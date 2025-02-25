import ExpenseTracker from "../components/ExpenseTracker";
import ExpensePieChart from "@/components/ExpensePieChart";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 relative">
      <ExpenseTracker />
      <ExpensePieChart />
    </div>
  );
}
