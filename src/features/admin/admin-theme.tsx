"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const ADMIN_THEME_KEY = "admin-theme";

type AdminThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined"
      ? ((localStorage.getItem(ADMIN_THEME_KEY) as Theme | null) ?? "dark")
      : "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    return () => {
      document.documentElement.classList.add("dark");
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      localStorage.setItem(ADMIN_THEME_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}