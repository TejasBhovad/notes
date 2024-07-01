"use client";
import Sun from "./logo/Sun";
import Moon from "./logo/Moon";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitcher = ({ isMobile }) => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center">
        {isMounted && (
          <>
            {theme === "dark" ? (
              <button
                onClick={() => setTheme("light")}
                className="flex items-center gap-2 p-1 text-sm"
              >
                <Sun /> Light Mode
              </button>
            ) : (
              <button
                onClick={() => setTheme("dark")}
                className="flex items-center gap-2 p-1 text-sm"
              >
                <Moon /> Dark Mode
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-util/50 h-full aspect-square rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
      {isMounted && (
        <>
          {theme === "dark" ? (
            <button
              onClick={() => setTheme("light")}
              className="w-full h-full flex items-center justify-center"
            >
              <Sun />
            </button>
          ) : (
            <button
              className="w-full h-full flex items-center justify-center"
              onClick={() => setTheme("dark")}
            >
              <Moon />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
