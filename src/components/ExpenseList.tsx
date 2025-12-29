import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteDoc(doc(db, "expenses", id));
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async () => {
    if (editingExpense) {
      const expenseRef = doc(db, "expenses", editingExpense.id);
      await updateDoc(expenseRef, {
        amount: Number(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
        description: editingExpense.description,
      });

      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id ? editingExpense : exp
        )
      );
      setEditingExpense(null);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        💰 Expense List
      </h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No expenses added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow flex items-center justify-between"
            >
              {/* Expense Details */}
              <div className="flex-grow mr-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  ₹{expense.amount}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {expense.category}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {expense.date}
                </p>
                {expense.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {expense.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(expense)}
                  className="inline-flex items-center px-3 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="inline-flex items-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form */}
      {editingExpense && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold mb-4 dark:text-white">
            Edit Expense
          </h3>
          <div className="space-y-4">
            <input
              type="number"
              value={editingExpense.amount}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, amount: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Amount"
            />
            <input
              type="text"
              value={editingExpense.category}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  category: e.target.value,
                })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Category"
            />
            <input
              type="date"
              value={editingExpense.date}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, date: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              value={editingExpense.description}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Description (optional)"
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            >
              Update Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
