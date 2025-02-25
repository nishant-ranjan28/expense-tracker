"use client";

import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import ExportData from "../../components/utils/ExportData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("monthly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const getFilteredExpenses = () => {
    if (filter === "custom" && startDate && endDate) {
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    } else {
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
    }
  };

  const filteredExpenses = getFilteredExpenses();

  const categoryData = filteredExpenses.reduce((acc, expense) => {
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

  const dateData = filteredExpenses.reduce((acc, expense) => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex">
            <button
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                filter === "weekly"
                  ? "bg-[#2563eb] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("weekly")}
            >
              Weekly Report
            </button>
            <button
              className={`px-4 py-2 transition-colors ${
                filter === "monthly"
                  ? "bg-[#2563eb] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("monthly")}
            >
              Monthly Report
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                filter === "custom"
                  ? "bg-[#2563eb] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("custom")}
            >
              Custom Range
            </button>
          </div>
          {filter === "custom" && (
            <div className="flex space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
          <ExportData
            className="px-4 py-2 border border-[#2563eb] text-[#2563eb] rounded-lg transition-colors hover:bg-[#2563eb] hover:text-white"
            expenses={filteredExpenses}
            pieChartData={pieChartData}
            barChartData={barChartData}
          />
        </div>
      </div>
      <p className="text-center text-gray-600 mb-4">
        {filter === "custom" && startDate && endDate
          ? `Showing data from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
          : `Showing data for the last ${filter === "weekly" ? "week" : "month"}`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white p-6 shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Total Expenses</h2>
          <p className="text-4xl text-[#2563eb]">
            $
            {filteredExpenses
              .reduce((sum, exp) => sum + exp.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        {filteredExpenses.length > 0 ? (
          <>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                Expenses by Category
              </h2>
              <PieChart data={pieChartData} />
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                Expenses by Date
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
