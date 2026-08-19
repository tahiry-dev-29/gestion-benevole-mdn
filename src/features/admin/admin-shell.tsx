"use client";

import { createContext, type ReactNode,useContext, useState } from "react";

import { cn } from "@/lib/utils";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}
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
