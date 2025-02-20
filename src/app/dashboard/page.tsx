"use client";

import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import ExportData from "../../components/utils/ExportData"; // ✅ Export Button Import

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filter, setFilter] = useState("monthly");

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenseData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expenseData);
    };

    fetchExpenses();
  }, []);

  // Filter expenses based on selected filter (weekly or monthly)
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

  // Category-wise Summarization (Pie Chart)
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

  // Date-wise Summarization (Bar Chart)
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
      <div className="mb-4 flex justify-between">
        <div>
          <button
            className={`px-4 py-2 rounded-lg mr-2 ${
              filter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("weekly")}
          >
            Weekly Report
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("monthly")}
          >
            Monthly Report
          </button>
        </div>
        {/* ✅ Export Button */}
        <ExportData
          expenses={filteredExpenses}
          pieChartData={pieChartData}
          barChartData={barChartData}
        />
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
