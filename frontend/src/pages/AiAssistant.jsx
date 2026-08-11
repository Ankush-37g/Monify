import { useState, useRef, useContext, useEffect } from "react";
import { BsStars, BsRobot } from "react-icons/bs";
import { IoCloudUploadOutline, IoSend } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaArrowTrendDown, FaArrowTrendUp, FaFilePdf } from "react-icons/fa6";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../utils/Api.js";
import { UserContext } from "../context/UserContext.jsx";

const CATEGORIES = [
  "Food", "Transport", "Shopping", "Entertainment",
  "Bills", "Salary", "Transfer", "Investment", "Health", "Education", "Other"
];

const QUICK_QUESTIONS = [
  "Where am I overspending?",
  "Give me a monthly summary",
  "What are my top 3 expenses?",
  "How can I save more money?",
];

const AiAssistant = () => {
  const { setExpenses, setIncomes } = useContext(UserContext);

  // ── Upload & Parse state ──────────────────────
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [transactions, setTransactions] = useState([]); // extracted rows
  const [selectedRows, setSelectedRows] = useState(new Set()); // checked rows
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // ── Chatbot state ─────────────────────────────
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! I'm your Monify AI assistant 👋\nUpload a bank statement to import transactions, or ask me anything about your spending.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // ── File helpers ──────────────────────────────
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setTransactions([]);
    } else {
      toast.error("Only PDF files are supported");
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setTransactions([]);
    }
  };

  // ── Parse PDF via backend → Python OCR ───────
  const handleParse = async () => {
    if (!file) return;
    setIsParsing(true);
    setTransactions([]);

    try {
      const formData = new FormData();
      formData.append("statement", file);

      const res = await api.post("/ai/parse-statement", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      if (res.data.success) {
        const txns = res.data.data.transactions;
        setTransactions(txns);
        // Pre-select all rows
        setSelectedRows(new Set(txns.map((_, i) => i)));
        toast.success(`Extracted ${txns.length} transactions — review and confirm below`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to parse statement");
    } finally {
      setIsParsing(false);
    }
  };

  // ── Row editing helpers ───────────────────────
  const toggleRow = (i) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === transactions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(transactions.map((_, i) => i)));
    }
  };

  const updateRow = (i, field, value) => {
    setTransactions((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t))
    );
  };

  // ── Save confirmed transactions ───────────────
  const handleSave = async () => {
    const toSave = transactions.filter((_, i) => selectedRows.has(i));
    if (toSave.length === 0) {
      toast.error("No transactions selected");
      return;
    }
    setIsSaving(true);
    try {
      const res = await api.post("/ai/save-transactions", { transactions: toSave });
      if (res.data.success) {
        const { savedExpenses, savedIncomes, total } = res.data.data;
        toast.success(`Saved ${total} transactions (${savedExpenses} expenses, ${savedIncomes} incomes)`);
        // Clear the upload section
        setFile(null);
        setTransactions([]);
        setSelectedRows(new Set());
        // Add confirmation message to chat
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: `✅ Done! I've added **${savedExpenses} expenses** and **${savedIncomes} income entries** to your account. Your dashboard and reports are now updated.`,
          },
        ]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save transactions");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Chatbot send ──────────────────────────────
  const handleSend = async (question) => {
    const q = (question || input).trim();
    if (!q) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setIsThinking(true);

    try {
      const res = await api.post("/ai/insights", { question: q });
      if (res.data.success) {
        setMessages((prev) => [...prev, { role: "ai", text: res.data.data.answer }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't get insights right now. Please try again." },
      ]);
      toast.error(err.response?.data?.message || "Failed to get insights");
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 relative text-gray-200">

      {/* ── Page Header ─────────────────────────── */}
      <div className="border-0 px-5 pt-5 pb-5 shadow-lg bg-gray-900 rounded-xl w-full flex flex-col">
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-2">
            <BsStars className="text-teal-400 text-2xl" />
            <p className="text-3xl font-semibold">AI Assistant</p>
          </div>
          <p className="font-light text-gray-400">
            Upload your bank statement to auto-import transactions, or ask for spending insights.
          </p>
        </div>
      </div>

      {/* ── Main Grid: Upload (left) + Chat (right) ── */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">

        {/* ── LEFT: Upload & Review ─────────────────── */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">

          {/* Upload card */}
          <div className="border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl">
            <p className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaFilePdf className="text-teal-400" /> Upload Bank Statement
            </p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 
                ${isDragging ? "border-teal-400 bg-teal-900/20" : "border-gray-600 hover:border-teal-500 hover:bg-gray-800"}`}
            >
              <IoCloudUploadOutline className="text-teal-400 text-4xl mb-3" />
              {file ? (
                <div className="text-center">
                  <p className="font-semibold text-teal-400">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-medium">Drag & drop your PDF here</p>
                  <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-500 mt-2">Supports UPI / bank statement PDFs</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleParse}
                disabled={!file || isParsing}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200
                  ${!file || isParsing
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-black hover:bg-teal-400 hover:text-white"}`}
              >
                {isParsing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-teal-400 rounded-full animate-spin" />
                    Scanning PDF...
                  </>
                ) : (
                  <><BsStars /> Extract Transactions</>
                )}
              </button>

              {file && (
                <button
                  onClick={() => { setFile(null); setTransactions([]); setSelectedRows(new Set()); }}
                  className="px-3 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                >
                  <RxCross2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* ── Review Table ───────────────────────── */}
          {transactions.length > 0 && (
            <div className="border border-amber-100 p-5 shadow-lg bg-gray-900 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold">
                  Review Transactions
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({selectedRows.size} of {transactions.length} selected)
                  </span>
                </p>
                <button
                  onClick={toggleAll}
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  {selectedRows.size === transactions.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800 text-gray-400">
                    <tr>
                      <th className="px-3 py-2 text-left w-8">✓</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                      <th className="px-3 py-2 text-center">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, i) => (
                      <tr
                        key={i}
                        className={`border-t border-gray-700 transition-colors duration-150 
                          ${selectedRows.has(i) ? "hover:bg-gray-750" : "opacity-40"}`}
                      >
                        {/* Checkbox */}
                        <td className="px-3 py-2">
                          <button onClick={() => toggleRow(i)} className="text-teal-400 hover:text-teal-300">
                            {selectedRows.has(i)
                              ? <MdOutlineCheckBox className="w-5 h-5" />
                              : <MdOutlineCheckBoxOutlineBlank className="w-5 h-5" />
                            }
                          </button>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <input
                            type="date"
                            value={txn.date}
                            onChange={(e) => updateRow(i, "date", e.target.value)}
                            className="bg-transparent border-b border-gray-600 focus:border-teal-400 outline-none text-xs w-28"
                          />
                        </td>

                        {/* Description */}
                        <td className="px-3 py-2 max-w-[120px]">
                          <input
                            type="text"
                            value={txn.description}
                            onChange={(e) => updateRow(i, "description", e.target.value)}
                            className="bg-transparent border-b border-gray-600 focus:border-teal-400 outline-none w-full text-xs truncate"
                          />
                        </td>

                        {/* Category dropdown */}
                        <td className="px-3 py-2">
                          <select
                            value={txn.category}
                            onChange={(e) => updateRow(i, "category", e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-xs focus:border-teal-400 outline-none"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>

                        {/* Amount */}
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={txn.amount}
                            onChange={(e) => updateRow(i, "amount", e.target.value)}
                            className="bg-transparent border-b border-gray-600 focus:border-teal-400 outline-none text-xs w-20 text-right"
                          />
                        </td>

                        {/* Type badge */}
                        <td className="px-3 py-2 text-center">
                          <span
                            onClick={() => updateRow(i, "type", txn.type === "expense" ? "income" : "expense")}
                            className={`cursor-pointer px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 justify-center w-fit mx-auto
                              ${txn.type === "expense"
                                ? "bg-red-400/20 text-red-400"
                                : "bg-teal-400/20 text-teal-400"}`}
                          >
                            {txn.type === "expense"
                              ? <><FaArrowTrendDown className="w-3 h-3" /> Exp</>
                              : <><FaArrowTrendUp className="w-3 h-3" /> Inc</>
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isSaving || selectedRows.size === 0}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all duration-200
                  ${isSaving || selectedRows.size === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-black hover:bg-teal-400 hover:text-white"}`}
              >
                {isSaving ? (
                  <><span className="w-4 h-4 border-2 border-gray-400 border-t-teal-400 rounded-full animate-spin" /> Saving...</>
                ) : (
                  `Save ${selectedRows.size} Transaction${selectedRows.size !== 1 ? "s" : ""}`
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Chatbot ───────────────────────── */}
        <div className="border border-amber-100 shadow-lg bg-gray-900 rounded-xl w-full lg:w-1/2 flex flex-col" style={{ minHeight: "520px" }}>

          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center">
              <BsRobot className="text-white text-lg" />
            </div>
            <div>
              <p className="font-semibold text-white">Monify AI</p>
              <p className="text-xs text-teal-400">Spending Insights</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <BsStars className="text-white text-xs" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === "user"
                      ? "bg-teal-600 text-white rounded-tr-sm"
                      : "bg-gray-800 text-gray-200 rounded-tl-sm"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <BsStars className="text-white text-xs" />
                </div>
                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-5 pb-2 flex gap-2 flex-wrap">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isThinking}
                className="text-xs px-3 py-1.5 rounded-full border border-teal-600 text-teal-400 hover:bg-teal-600 hover:text-white transition-all duration-200 disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-5 py-4 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your spending..."
              disabled={isThinking}
              className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:border-teal-400 focus:outline-none transition-colors duration-200 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking}
              className={`px-4 py-2.5 rounded-xl flex items-center justify-center transition-all duration-200
                ${!input.trim() || isThinking
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-500"}`}
            >
              <IoSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
