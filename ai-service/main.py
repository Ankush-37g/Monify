import os
import json
import re

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Monify AI Service", version="1.0.0")

# Allow calls from Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Mistral client
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise RuntimeError("MISTRAL_API_KEY is not set in environment variables")

client = Mistral(api_key=MISTRAL_API_KEY)


# ─────────────────────────────────────────────
#  Pydantic Models
# ─────────────────────────────────────────────

class InsightRequest(BaseModel):
    question: str
    transactions_summary: str  # Pre-formatted string from Node.js


class InsightResponse(BaseModel):
    answer: str


# ─────────────────────────────────────────────
#  Prompts
# ─────────────────────────────────────────────

PARSE_SYSTEM_PROMPT = """
You are a financial data extraction expert. You will receive the text content of a bank statement.
Your job is to extract ALL transactions and return them as a valid JSON array.

Each transaction object must have EXACTLY these fields:
- "date": string in "YYYY-MM-DD" format
- "amount": number (always positive)
- "description": string (merchant name or brief description)
- "type": "income" or "expense"
- "category": one of [Food, Transport, Shopping, Entertainment, Bills, Salary, Transfer, Investment, Health, Education, Other]

Rules:
- Credits/deposits/salary/refunds -> type: "income"
- Debits/payments/withdrawals -> type: "expense"
- Transfers between own accounts -> type: "expense" with category "Transfer"
- If date format is unclear, use your best guess in YYYY-MM-DD
- Return ONLY the JSON array, no explanation, no markdown code blocks, no extra text.

Example output:
[{"date":"2024-01-15","amount":50000,"description":"Salary Credit","type":"income","category":"Salary"},{"date":"2024-01-16","amount":450,"description":"Swiggy Order","type":"expense","category":"Food"}]
"""

INSIGHTS_SYSTEM_PROMPT = """
You are Monify AI, a friendly and knowledgeable personal finance advisor.
You will receive a summary of the user's spending data and their question.
Give clear, concise, actionable advice. Be conversational but professional.
Use the rupee symbol for Indian Rupees. Format amounts with commas (e.g. Rs. 1,200).
Keep your response under 200 words unless a detailed breakdown is requested.
Do not use excessive markdown — use plain text with occasional bold for emphasis.
"""


# ─────────────────────────────────────────────
#  Helper: Upload file to Mistral and run OCR
# ─────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes, filename: str) -> str:
    """Upload PDF to Mistral Files API, run OCR, return extracted markdown text."""

    # Upload the file to Mistral
    uploaded_file = client.files.upload(
        file={
            "file_name": filename,
            "content": file_bytes,
        },
        purpose="ocr"
    )

    # Get a signed URL to reference the file
    signed_url = client.files.get_signed_url(file_id=uploaded_file.id)

    # Run OCR on the uploaded file
    ocr_response = client.ocr.process(
        model="mistral-ocr-latest",
        document={
            "type": "document_url",
            "document_url": signed_url.url,
        }
    )

    # Concatenate all pages markdown
    full_text = "\n\n".join(page.markdown for page in ocr_response.pages)

    # Clean up the uploaded file to avoid storage build-up
    try:
        client.files.delete(file_id=uploaded_file.id)
    except Exception:
        pass  # Non-critical, ignore deletion errors

    return full_text


# ─────────────────────────────────────────────
#  Helper: Parse extracted text into transactions
# ─────────────────────────────────────────────

def parse_transactions_from_text(text: str) -> list:
    """Send extracted PDF text to Mistral Chat for structured JSON extraction."""

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[
            {"role": "system", "content": PARSE_SYSTEM_PROMPT},
            {"role": "user", "content": f"Here is the bank statement text:\n\n{text}"}
        ],
        temperature=0.1,  # Low temperature for accurate, deterministic parsing
    )

    raw = response.choices[0].message.content.strip()

    # Strip any accidental markdown code fences the model might add
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    transactions = json.loads(raw)

    if not isinstance(transactions, list):
        raise ValueError("LLM did not return a JSON array")

    return transactions


# ─────────────────────────────────────────────
#  Endpoint 1: Parse Bank Statement PDF
# ─────────────────────────────────────────────

@app.post("/parse")
async def parse_statement(file: UploadFile = File(...)):
    """
    Accepts a PDF bank statement, runs Mistral OCR, extracts transactions.
    Returns a list of transaction objects for the frontend review table.
    """

    # Validate file type
    if file.content_type not in ["application/pdf", "application/octet-stream"]:
        if not (file.filename or "").lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        file_bytes = await file.read()

        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # Step 1: OCR — extract text from PDF
        extracted_text = extract_text_from_pdf(file_bytes, file.filename or "statement.pdf")

        if not extracted_text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from the PDF. It may be a scanned image with poor quality."
            )

        # Step 2: LLM — parse text into structured transactions
        transactions = parse_transactions_from_text(extracted_text)

        return {
            "success": True,
            "count": len(transactions),
            "transactions": transactions
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=422,
            detail="AI could not parse transactions from this statement. The format may be unsupported."
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
#  Endpoint 2: Spending Insights Chatbot
# ─────────────────────────────────────────────

@app.post("/insights", response_model=InsightResponse)
async def get_insights(body: InsightRequest):
    """
    Accepts a user question and their pre-summarized transaction data.
    Returns a conversational AI response with spending insights.
    """

    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": INSIGHTS_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"Here is my spending data:\n\n{body.transactions_summary}"
                        f"\n\nMy question: {body.question}"
                    )
                }
            ],
            temperature=0.7,
        )

        answer = response.choices[0].message.content.strip()
        return InsightResponse(answer=answer)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
#  Health Check
# ─────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Monify AI Service"}
