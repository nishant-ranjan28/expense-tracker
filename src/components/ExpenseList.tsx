"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expensesData); // ✅ Directly set state with Firestore data
    });

    return () => unsubscribe(); // ✅ Cleanup listener
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-center">📜 Expense List</h2>
      <div className="mt-4 space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 bg-green-100 rounded-md shadow-md"
          >
            <h3 className="font-bold">{expense.category} 📌</h3>
            <p>{expense.description}</p>
            <p className="text-gray-600">{expense.date}</p>
            <p className="text-lg font-semibold">₹{expense.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
