import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Please fill all required fields!");
      return;
    }

    const newExpense = {
      amount: Number(amount),
      category,
      date: new Date(date).toISOString(),
      description,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "expenses"), newExpense);
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
    } catch (error) {
      console.error("❌ Error adding expense:", error);
    }
  };

  return (
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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
      >
        🚀 Add Expense
      </button>

      <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-full animate-pulse"></div>
    </form>
  );
};

export default ExpenseForm;
