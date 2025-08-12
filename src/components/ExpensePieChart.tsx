"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const ExpensePieChart = () => {
  const [categoryData, setCategoryData] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const expenses = querySnapshot.docs.map((doc) => doc.data());

      // Group expenses by category
      const categoryMap: { [key: string]: number } = {};
      expenses.forEach((expense: any) => {
        const { category, amount } = expense;
        categoryMap[category] = (categoryMap[category] || 0) + Number(amount);
      });

      setCategoryData(categoryMap);
    };

    fetchExpenses();
  }, []);

  const totalAmount = Object.values(categoryData).reduce(
    (acc, val) => acc + val,
    0
  );

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#8E44AD",
        ],
        hoverBackgroundColor: [
          "#FF4C60",
          "#2F86EB",
          "#FFD633",
          "#3E9C40",
          "#6A1B9A",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Category-wise Spending",
        font: { size: 18, weight: 700 },
        color: "#333",
      },
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          font: { size: 14, weight: 400 },
          color: "#555",
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: 700, size: 14 },
        formatter: (value: number) => {
          const percentage = ((value / totalAmount) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto mt-6">
      {Object.keys(categoryData).length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <p className="text-center text-gray-500">No expenses to display.</p>
      )}
    </div>
  );
};

export default ExpensePieChart;
