"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

type Theme = "dark" | "light";
const ADMIN_THEME_KEY = "admin-theme";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
  theme: Theme;
  toggleTheme: () => void;
};

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
  theme: "dark",
  toggleTheme: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem(ADMIN_THEME_KEY) as Theme | null) ?? "dark"
      : "dark"
  );

  // Admin-only theme: toggle .dark on <html> while in the admin section,
  // restore the public default (dark) when leaving.
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
    <SidebarContext.Provider
      value={{
        collapsed,
        toggle: () => setCollapsed((c) => !c),
        theme,
        toggleTheme,
      }}
    >
      <div className="flex min-h-screen bg-muted/30">
        <aside
          className={cn(
            "hidden shrink-0 border-r bg-card transition-[width] duration-200 ease-in-out md:block",
            collapsed ? "w-[68px]" : "w-64"
          )}
        >
          <div className="sticky top-0 h-screen">
            <AdminSidebar collapsed={collapsed} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
