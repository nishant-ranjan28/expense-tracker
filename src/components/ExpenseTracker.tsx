"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import ExpenseForm from "./ExpenseForm"; // ✅ Ensure correct import

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
};

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // 🔹 Firestore se expenses fetch karna
  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expensesList: Expense[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Expense, "id">),
      }));
      setExpenses(expensesList);
    };

    fetchExpenses();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Expense Tracker</h1>
      <ExpenseForm />

      {/* 🔹 Expense List */}
      <h2 className="text-xl font-semibold mt-6 mb-3">Expenses</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="bg-white p-3 rounded-lg shadow flex justify-between"
              >
                <div>
                  <p className="font-semibold">{expense.category}</p>
                  <p className="text-gray-500 text-sm">{expense.date}</p>
                  <p className="text-gray-700">{expense.description}</p>
                </div>
                <p className="font-bold text-green-600">₹{expense.amount}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
