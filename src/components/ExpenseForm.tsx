"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ExpenseFormProps = {
  onExpenseAdded: () => void;
};

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount, date, description }),
      });
      if (!res.ok) {
        throw new Error("Failed to add expense");
      }
      onExpenseAdded(); // Trigger a re-fetch in the parent after successful addition
      setCategory("");
      setAmount(0);
      setDate("");
      setDescription("");
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding expense!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md shadow-xl p-8 rounded-2xl border border-gray-200 max-w-lg mx-auto mt-10 relative"
      >
        <h2 className="text-4xl font-bold text-center text-white drop-shadow-lg mb-6">
          💰 Add Expense
        </h2>

        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">💡 Bills</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105 shadow-lg"
          disabled={loading}
        >
          {loading ? "Adding..." : "🚀 Add Expense"}
        </button>

        <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-full animate-pulse"></div>
      </form>
      <ToastContainer />
    </div>
  );
}
