"use client";

import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReportsChart = () => {
  const [monthlyData, setMonthlyData] = useState<any>({});
  const [weeklyData, setWeeklyData] = useState<any>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: data.amount,
          date: data.date,
        };
      });

      // 🔹 Group Data by Month
      const monthlySummary: Record<string, number> = {};
      const weeklySummary: Record<string, number> = {};

      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const month = date.toLocaleString("default", { month: "short" });
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;

        // Monthly Summary
        monthlySummary[month] = (monthlySummary[month] || 0) + expense.amount;
        // Weekly Summary
        weeklySummary[week] = (weeklySummary[week] || 0) + expense.amount;
      });

      setMonthlyData({
        labels: Object.keys(monthlySummary),
        datasets: [
          {
            label: "Monthly Expenses",
            data: Object.values(monthlySummary),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });

      setWeeklyData({
        labels: Object.keys(weeklySummary),
        datasets: [
          {
            label: "Weekly Expenses",
            data: Object.values(weeklySummary),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            fill: true,
          },
        ],
      });
    };

    fetchExpenses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          📅 Monthly Expenses
        </h2>
        <Bar data={monthlyData} />
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          📆 Weekly Expenses
        </h2>
        <Line data={weeklyData} />
      </div>
    </div>
  );
};

export default ReportsChart;
