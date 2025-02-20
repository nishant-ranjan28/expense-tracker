"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const SummaryCards = ({ filter }: { filter: "weekly" | "monthly" }) => {
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const snapshot = await getDocs(collection(db, "expenses"));
      const expenses = snapshot.docs.map((doc) => doc.data());

      // Calculate total expenses based on filter
      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return filter === "weekly"
          ? expenseDate > new Date(now.setDate(now.getDate() - 7))
          : expenseDate > new Date(now.setMonth(now.getMonth() - 1));
      });

      setTotalExpense(
        filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      );
    };

    fetchExpenses();
  }, [filter]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold">Total {filter} Expenses</h3>
        <p className="text-2xl">₹{totalExpense}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
