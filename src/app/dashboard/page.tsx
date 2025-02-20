"use client";

import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);

  // ✅ Firestore se Expenses Fetch Karna
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

  // ✅ Category-wise Summarization (Pie Chart)
  const categoryData = expenses.reduce((acc: any, expense) => {
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

  // ✅ Date-wise Summarization (Bar Chart)
  const dateData = expenses.reduce((acc: any, expense) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart data={pieChartData} />
        <BarChart data={barChartData} />
      </div>
    </div>
  );
}
