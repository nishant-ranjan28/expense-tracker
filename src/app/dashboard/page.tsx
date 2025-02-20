"use client";

import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filter, setFilter] = useState("monthly");
  const [budget, setBudget] = useState<number>(0);
  const [userBudget, setUserBudget] = useState<number | "">("");

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenseData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expenseData);
    };

    const fetchBudget = async () => {
      const budgetDoc = await getDoc(doc(db, "settings", "budget"));
      if (budgetDoc.exists()) {
        setBudget(budgetDoc.data().limit);
      }
    };

    fetchExpenses();
    fetchBudget();
  }, []);

  const saveBudget = async () => {
    if (userBudget !== "") {
      await setDoc(doc(db, "settings", "budget"), {
        limit: Number(userBudget),
      });
      setBudget(Number(userBudget));
    }
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return filter === "weekly"
        ? expenseDate >= weekAgo
        : expenseDate >= monthAgo;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const budgetUsage = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const categoryData = filteredExpenses.reduce((acc: any, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(
    ([category, amount]) => ({
      category,
      amount: amount as number,
    })
  );

  const dateData = filteredExpenses.reduce((acc: any, expense) => {
    const { date, amount } = expense;
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  const barChartData = Object.entries(dateData).map(([date, amount]) => ({
    date,
    amount: amount as number,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-lg mr-2 ${filter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("weekly")}
        >
          Weekly Report
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("monthly")}
        >
          Monthly Report
        </button>
      </div>
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-bold mb-2">🎯 Set Budget</h2>
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Enter Budget"
          value={userBudget}
          onChange={(e) =>
            setUserBudget(e.target.value !== "" ? Number(e.target.value) : "")
          }
        />
        <button
          onClick={saveBudget}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Budget
        </button>
      </div>
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-bold mb-2">💰 Budget Usage</h2>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className={`h-6 ${budgetUsage > 100 ? "bg-red-500" : budgetUsage > 75 ? "bg-yellow-500" : "bg-green-500"}`}
            style={{ width: `${Math.min(budgetUsage, 100)}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-600">
          {totalSpent} spent out of {budget}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExpenses.length > 0 ? (
          <>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                📅 Monthly Expenses
              </h2>
              <PieChart data={pieChartData} />
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                📆 Weekly Expenses
              </h2>
              <BarChart data={barChartData} />
            </div>
          </>
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No expenses available for the selected period.
          </div>
        )}
      </div>
    </div>
  );
}
