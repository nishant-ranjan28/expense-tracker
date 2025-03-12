import { useTheme } from "@/context/ThemeContext";
import { format } from "date-fns";
import {
  FaShoppingCart,
  FaUtensils,
  FaCar,
  FaHome,
  FaEllipsisH,
} from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";

// Define your Expense type accordingly
type Expense = {
  id: string;
  category: "Food" | "Shopping" | "Transport" | "Rent" | "Other";
  date: string;
  amount: number;
  // ...other properties
};

type ExpenseListProps = {
  expenses?: Expense[] | null;
};

const categoryIcons = {
  Food: <FaUtensils className="text-green-500" />,
  Shopping: <FaShoppingCart className="text-blue-500" />,
  Transport: <FaCar className="text-yellow-500" />,
  Rent: <FaHome className="text-red-500" />,
  Other: <FaEllipsisH className="text-gray-500" />,
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  // Convert undefined or null to an empty array
  const effectiveExpenses = expenses ?? [];

  // Remove loading state so that an empty array displays "No expenses found"
  if (effectiveExpenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  const { theme } = useTheme();

  return (
    <div className="p-4 rounded-lg shadow-md w-full bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Expense List
      </h2>
      <div className="space-y-3">
        {effectiveExpenses.map((expense) => (
          <motion.div
            key={expense.id}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between items-center p-3 rounded-lg shadow-sm transition-all bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              {categoryIcons[expense.category] || categoryIcons.Other}
              <div>
                <p className="text-sm font-medium dark:text-white">
                  {expense.category}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(expense.date), "dd MMM yyyy")}
                </p>
              </div>
            </div>
            <p
              className={`font-semibold ${
                expense.amount > 1000
                  ? "text-red-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              ₹{expense.amount}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
