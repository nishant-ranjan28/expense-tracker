import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { category: string; amount: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Category-wise total spending calculation
  const categoryTotals = data.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // Extract labels and values
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  // Pie Chart Data
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 8,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            let value = tooltipItem.raw;
            let total = values.reduce((sum, val) => sum + val, 0);
            let percentage = ((value / total) * 100).toFixed(2);
            return `₹${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-center mb-4">
        Category-wise Spending
      </h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
