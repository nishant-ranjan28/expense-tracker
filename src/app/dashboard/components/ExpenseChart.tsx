"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const ExpenseChart = ({ filter }: { filter: "weekly" | "monthly" }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const snapshot = await getDocs(collection(db, "expenses"));
      const expenses = snapshot.docs.map((doc) => doc.data());

      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return filter === "weekly"
          ? expenseDate > new Date(now.setDate(now.getDate() - 7))
          : expenseDate > new Date(now.setMonth(now.getMonth() - 1));
      });

      const categories = ["Food", "Travel", "Shopping", "Bills"];
      const categoryData = categories.map((category) =>
        filteredExpenses
          .filter((exp) => exp.category === category)
          .reduce((sum, exp) => sum + exp.amount, 0)
      );

      setChartData({
        labels: categories,
        datasets: [
          {
            label: "Expenses",
            data: categoryData,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
          },
        ],
      });
    };

    fetchExpenses();
  }, [filter]);

  if (!chartData) return <p>Loading Charts...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold">📊 Category-wise Pie Chart</h3>
        <Pie data={chartData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold">📈 Category-wise Bar Chart</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseChart;
