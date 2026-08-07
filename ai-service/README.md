# Monify AI Service

Python FastAPI microservice that powers the AI features in Monify using **Mistral AI**.

## What it does
- **`POST /parse`** — Accepts a PDF bank statement, runs Mistral OCR to extract text, then uses Mistral Chat to return structured JSON transactions
- **`POST /insights`** — Accepts a user question + spending summary, returns a conversational AI response
- **`GET /health`** — Health check

## Setup

### 1. Create a virtual environment
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
# venv\Scripts\activate    # Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Open .env and add your Mistral API key
# Get one free at: https://console.mistral.ai/
```

### 4. Run the service
```bash
uvicorn main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`

## API Docs
Once running, visit `http://localhost:8000/docs` for the interactive Swagger UI.

## Notes
- This service must be running alongside the Node.js backend for AI features to work
- The Node.js backend calls this service internally — it is **not** exposed to the frontend directly
- Mistral OCR API has usage limits on the free tier — check your console at https://console.mistral.ai/
