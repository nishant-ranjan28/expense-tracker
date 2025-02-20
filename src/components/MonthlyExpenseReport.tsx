"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyExpenseReport = () => {
  const [monthlyData, setMonthlyData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenses = querySnapshot.docs.map((doc) => doc.data());

      const monthlyMap: { [key: string]: number } = {};
      expenses.forEach((expense: any) => {
        const month = new Date(expense.date).toLocaleString("default", {
          month: "short",
        }); // "Jan", "Feb"
        monthlyMap[month] = (monthlyMap[month] || 0) + Number(expense.amount);
      });

      setMonthlyData(monthlyMap);
    };

    fetchExpenses();
  }, []);

  const data = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Spending (₹)",
        data: Object.values(monthlyData),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Spending Trends",
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
      {Object.keys(monthlyData).length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-center text-gray-500">No expenses recorded.</p>
      )}
    </div>
  );
};

export default MonthlyExpenseReport;
