"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyExpenseReport = () => {
  const [weeklyData, setWeeklyData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenses = querySnapshot.docs.map((doc) => doc.data());

      const weeklyMap: { [key: string]: number } = {};
      expenses.forEach((expense: any) => {
        const week = `Week ${Math.ceil(new Date(expense.date).getDate() / 7)}`;
        weeklyMap[week] = (weeklyMap[week] || 0) + Number(expense.amount);
      });

      setWeeklyData(weeklyMap);
    };

    fetchExpenses();
  }, []);

  const data = {
    labels: Object.keys(weeklyData),
    datasets: [
      {
        label: "Weekly Spending (₹)",
        data: Object.values(weeklyData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Weekly Spending Trends",
        font: { size: 18 },
        color: "#333",
      },
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `₹${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto mt-6">
      {Object.keys(weeklyData).length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p className="text-center text-gray-500">No expenses recorded.</p>
      )}
    </div>
  );
};

export default WeeklyExpenseReport;
