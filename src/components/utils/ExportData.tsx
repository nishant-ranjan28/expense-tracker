"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";

export default function ExportData({ expenses, pieChartData, barChartData }) {
  const [showModal, setShowModal] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);
  const csvLinkRef = useRef<CSVLink & HTMLAnchorElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ CSV Export Data
  const csvData = [
    ["Date", "Category", "Amount"],
    ...expenses.map((expense) => [
      expense.date,
      expense.category,
      expense.amount,
    ]),
    [],
    ["Category-wise Summary"],
    ["Category", "Amount"],
    ...pieChartData.map((data) => [data.category, data.amount]),
    [],
    ["Date-wise Summary"],
    ["Date", "Amount"],
    ...barChartData.map((data) => [data.date, data.amount]),
  ];

  // ✅ Automatically trigger CSV download when exportType is "csv"
  useEffect(() => {
    if (exportType === "csv" && csvLinkRef.current) {
      csvLinkRef.current.click();
      setExportType(null);
    }
  }, [exportType]);

  // ✅ PDF Export Function
  const exportPDF = async () => {
    setShowModal(false);
    const pdf = new jsPDF();

    // Charts Screenshot
    const chartElement = document.getElementById("charts-section");
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 180, 80);
    }

    // Expense Table
    pdf.text("Expense Report", 10, 100);
    let y = 110;
    pdf.text("Date - Category - Amount", 10, y);
    y += 10;
    expenses.forEach((expense, index) => {
      pdf.text(
        `${expense.date} - ${expense.category} - ₹${expense.amount}`,
        10,
        y
      );
      y += 10;
    });

    pdf.save("expense_report.pdf");
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Bar with Export Button */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          📤 Export Data
        </button>
      </div>

      {/* 🔹 Export Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-lg font-bold mb-4">Choose Export Type</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => {
                setExportType("csv");
                setShowModal(false);
              }}
            >
              CSV
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setExportType("pdf");
                setShowModal(false);
                exportPDF();
              }}
            >
              PDF
            </button>
          </div>
        </div>
      )}

      {/* 📜 Hidden CSV Link for Auto-download */}
      {isClient && (
        <CSVLink
          data={csvData}
          filename="expenses.csv"
          ref={csvLinkRef}
          className="hidden"
        />
      )}
    </div>
  );
}
