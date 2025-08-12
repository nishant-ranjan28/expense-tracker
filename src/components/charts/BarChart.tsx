"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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

interface BarChartProps {
  data: { date: string; amount: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Convert date to Month-Year format
  const monthlyTotals = data.reduce(
    (acc, expense) => {
      const monthYear = new Date(expense.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // Extract labels and values
  const labels = Object.keys(monthlyTotals);
  const values = Object.values(monthlyTotals);

  // Bar Chart Data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Expenses (₹)",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `₹${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-center mb-4">
        Monthly Spending
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
