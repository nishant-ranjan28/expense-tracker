"use client";
import ExpenseForm from "../../../components/ExpenseForm";
import ExpenseList from "../../../components/ExpenseList";

export default function ExpensesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📝 Expenses</h1>
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
}
