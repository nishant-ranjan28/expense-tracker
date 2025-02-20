"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">💰 Expense Tracker</h2>

      <nav className="space-y-4">
        <Link href="/dashboard">
          <p
            className={`p-3 rounded-lg ${pathname === "/dashboard" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          >
            📊 Dashboard
          </p>
        </Link>

        <Link href="/dashboard/expenses">
          <p
            className={`p-3 rounded-lg ${pathname === "/dashboard/expenses" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          >
            📝 Expenses
          </p>
        </Link>

        <Link href="/dashboard/reports">
          <p
            className={`p-3 rounded-lg ${pathname === "/dashboard/reports" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          >
            📅 Reports
          </p>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
