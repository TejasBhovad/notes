"use client";
import Sun from "./logo/Sun";
import Moon from "./logo/Moon";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitcher = ({ isMobile }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 p-1 text-sm"
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
        >
          {isDarkMode ? (
            <>
              <Sun /> Light Mode
            </>
          ) : (
            <>
              <Moon /> Dark Mode
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-util/50 h-full aspect-square rounded-full flex items-center justify-center hover:bg-util/100 transition-all">
      <button
        onClick={toggleTheme}
        className="w-full h-full flex items-center justify-center"
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      >
        {isDarkMode ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
