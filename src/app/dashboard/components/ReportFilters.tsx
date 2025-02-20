"use client";

const ReportFilters = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: any;
}) => {
  return (
    <div className="my-4 flex space-x-4">
      <button
        className={`p-2 rounded-lg ${filter === "weekly" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        onClick={() => setFilter("weekly")}
      >
        📅 Weekly Report
      </button>
      <button
        className={`p-2 rounded-lg ${filter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        onClick={() => setFilter("monthly")}
      >
        📆 Monthly Report
      </button>
    </div>
  );
};

export default ReportFilters;
