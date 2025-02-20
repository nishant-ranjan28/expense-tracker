"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function BudgetLimit() {
  const [budget, setBudget] = useState<number | null>(null);
  const [newBudget, setNewBudget] = useState("");

  useEffect(() => {
    const fetchBudget = async () => {
      const budgetDoc = await getDoc(doc(db, "settings", "budget"));
      if (budgetDoc.exists()) {
        setBudget(budgetDoc.data().limit);
      }
    };
    fetchBudget();
  }, []);

  const handleSaveBudget = async () => {
    if (newBudget) {
      await setDoc(doc(db, "settings", "budget"), { limit: Number(newBudget) });
      setBudget(Number(newBudget));
      setNewBudget("");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">🎯 Set Monthly Budget</h2>
      <p className="text-gray-600">Current Limit: ₹{budget ?? "Not Set"}</p>
      <input
        type="number"
        value={newBudget}
        onChange={(e) => setNewBudget(e.target.value)}
        placeholder="Enter budget limit"
        className="border p-2 rounded w-full mt-2"
      />
      <button
        onClick={handleSaveBudget}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-600"
      >
        Save Budget
      </button>
    </div>
  );
}
