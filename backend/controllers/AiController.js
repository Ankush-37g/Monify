import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Expense } from '../models/ExpenseModel.js';
import { Income } from '../models/IncomeModel.js';

// URL of the Python AI microservice (set in .env)
const AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';


// ─────────────────────────────────────────────────────────────────
//  1. PARSE STATEMENT
//  Receives uploaded PDF, forwards to Python service, returns
//  extracted transactions for the frontend review table
// ─────────────────────────────────────────────────────────────────

const parseStatement = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, 'No file uploaded. Please upload a PDF bank statement.');
    }

    const filePath = req.file.path;

    try {
        // Build multipart/form-data to forward the file to Python service
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath), {
            filename: req.file.originalname,
            contentType: 'application/pdf',
        });

        const response = await axios.post(`${AI_SERVICE_URL}/parse`, form, {
            headers: {
                ...form.getHeaders(),
            },
            timeout: 120000, // 2 min — OCR can take time on large PDFs
        });

        const { transactions, count } = response.data;

        return res
            .status(200)
            .json(new ApiResponse(200, { transactions, count }, `Successfully extracted ${count} transactions`));

    } catch (error) {

        // Relay the Python service's error message if available
        const message = error.response?.data?.detail || 'AI service failed to parse the statement';
        throw new ApiError(error.response?.status || 502, message);

    } finally {
        // Always clean up the temp file regardless of success/failure
        try {
            fs.unlinkSync(filePath);
        } catch (_) {
            // Ignore cleanup errors
        }
    }
});


// ─────────────────────────────────────────────────────────────────
//  2. SAVE TRANSACTIONS
//  Receives confirmed transaction list from frontend review table,
//  bulk-inserts into Expense / Income collections
// ─────────────────────────────────────────────────────────────────

const saveTransactions = asyncHandler(async (req, res) => {

    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        throw new ApiError(400, 'No transactions provided');
    }

    const userId = req.user._id;

    const expensesToInsert = [];
    const incomesToInsert  = [];

    for (const txn of transactions) {
        const { date, amount, description, type, category } = txn;

        // Basic validation per transaction
        if (!date || !amount || !type) continue;

        if (type === 'expense') {
            expensesToInsert.push({
                expenseCategory : category || 'Other',
                amount          : Number(amount),
                date            : new Date(date),
                user            : userId,
                isRecurring     : false,
                frequency       : null,
                nextDate        : null,
            });
        } else if (type === 'income') {
            incomesToInsert.push({
                incomeSource : description || category || 'Bank Statement Import',
                amount       : Number(amount),
                date         : new Date(date),
                user         : userId,
                isRecurring  : false,
                frequency    : null,
                nextDate     : null,
            });
        }
    }

    // Bulk insert both arrays (insertMany is atomic per collection)
    const [savedExpenses, savedIncomes] = await Promise.all([
        expensesToInsert.length > 0 ? Expense.insertMany(expensesToInsert) : [],
        incomesToInsert.length  > 0 ? Income.insertMany(incomesToInsert)   : [],
    ]);

    const totalSaved = savedExpenses.length + savedIncomes.length;

    return res
        .status(201)
        .json(new ApiResponse(201, {
            savedExpenses : savedExpenses.length,
            savedIncomes  : savedIncomes.length,
            total         : totalSaved,
        }, `${totalSaved} transactions saved successfully`));
});


// ─────────────────────────────────────────────────────────────────
//  3. GET INSIGHTS (Chatbot)
//  Fetches user's transaction data, summarizes it, sends to
//  Python service for a conversational AI response
// ─────────────────────────────────────────────────────────────────

const getInsights = asyncHandler(async (req, res) => {

    const { question } = req.body;

    if (!question || !question.trim()) {
        throw new ApiError(400, 'Question is required');
    }

    const userId = req.user._id;

    // Fetch last 90 days of data for context
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [expenses, incomes] = await Promise.all([
        Expense.find({ user: userId, date: { $gte: ninetyDaysAgo } }).sort({ date: -1 }),
        Income.find({ user: userId, date: { $gte: ninetyDaysAgo } }).sort({ date: -1 }),
    ]);

    // Build a compact summary string to inject as context
    const summary = buildTransactionSummary(expenses, incomes);

    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/insights`,
            { question: question.trim(), transactions_summary: summary },
            { timeout: 30000 }
        );

        const { answer } = response.data;

        return res
            .status(200)
            .json(new ApiResponse(200, { answer }, 'Insight generated successfully'));

    } catch (error) {
        const message = error.response?.data?.detail || 'AI service failed to generate insights';
        throw new ApiError(error.response?.status || 502, message);
    }
});


// ─────────────────────────────────────────────────────────────────
//  Helper: Build a readable transaction summary string for the LLM
// ─────────────────────────────────────────────────────────────────

function buildTransactionSummary(expenses, incomes) {

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome  = incomes.reduce((sum, i) => sum + i.amount, 0);
    const balance      = totalIncome - totalExpense;

    // Group expenses by category
    const byCategory = {};
    for (const e of expenses) {
        const cat = e.expenseCategory || 'Other';
        byCategory[cat] = (byCategory[cat] || 0) + e.amount;
    }

    // Sort categories by spend (highest first)
    const categoryLines = Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .map(([cat, amt]) => `  - ${cat}: Rs. ${amt.toLocaleString('en-IN')}`)
        .join('\n');

    // Recent 10 transactions for specifics
    const recent = [...expenses, ...incomes]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
        .map(t => {
            const isExpense = !!t.expenseCategory;
            const label = isExpense ? t.expenseCategory : (t.incomeSource || 'Income');
            const date  = new Date(t.date).toLocaleDateString('en-IN');
            return `  - [${isExpense ? 'Expense' : 'Income'}] ${date}: ${label} — Rs. ${t.amount.toLocaleString('en-IN')}`;
        })
        .join('\n');

    return `
Last 90 Days Financial Summary
================================
Total Income  : Rs. ${totalIncome.toLocaleString('en-IN')}
Total Expenses: Rs. ${totalExpense.toLocaleString('en-IN')}
Net Balance   : Rs. ${balance.toLocaleString('en-IN')}

Spending by Category:
${categoryLines || '  (No expenses recorded)'}

Recent Transactions:
${recent || '  (No recent transactions)'}
`.trim();
}


export { parseStatement, saveTransactions, getInsights };
