"use client"; // ✅ Client Component (For Interactivity)
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // ✅ Icons (lucide-react install karna hoga)

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md"
    >
      {theme === "dark" ? "🌞" : "🌜"}
    </button>
  );
}
