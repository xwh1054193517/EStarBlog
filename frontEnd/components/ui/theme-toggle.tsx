"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
  };

  if (!mounted) {
    return <div className={cn("h-8 w-16 rounded-full bg-muted", className)}></div>;
  }
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none",
        "bg-muted border-2 border-border hover:bg-accent",
        className
      )}
      title={theme === "light" ? "切换到深色模式" : "切换到亮色模式"}
    >
      <span
        className={cn(
          "absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300 ease-in-out z-20",
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        )}
      >
        {theme === "light" ? (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        )}
      </span>

      <span className="flex-1 flex justify-center z-10">
        <Sun
          className={cn(
            "w-3.5 h-3.5 transition-opacity duration-300",
            theme === "light" ? "opacity-100" : "opacity-30"
          )}
        />
      </span>

      <span className="flex-1 flex justify-center z-10">
        <Moon
          className={cn(
            "w-3.5 h-3.5 transition-opacity duration-300",
            theme === "dark" ? "opacity-100" : "opacity-30"
          )}
        />
      </span>
    </button>
  );
}
