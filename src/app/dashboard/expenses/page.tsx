"use client";
import React, { useEffect, useState } from "react";
import ExpenseForm from "../../../components/ExpenseForm";
import ExpenseList from "../../../components/ExpenseList";
import type { Expense } from "../../../components/ExpenseList";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses from your API (make sure your API route exists)
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data: Expense[] = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Callback triggered from ExpenseForm after successful expense addition
  const handleExpenseAdded = () => {
    // Re-fetch expenses from database
    fetchExpenses();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📝 Expenses</h1>
      {/* Keep your ExpenseForm code. Make sure ExpenseForm calls onExpenseAdded after adding an expense */}
      <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      {loading ? (
        <p>Loading expenses...</p>
      ) : (
        // ExpenseList now receives the fetched expenses from your database
        <ExpenseList expenses={expenses} />
      )}
    </div>
  );
}
