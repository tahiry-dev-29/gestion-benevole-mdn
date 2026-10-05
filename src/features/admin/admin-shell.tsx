"use client";

import { type ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminThemeProvider } from "./admin-theme";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminThemeProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="fluid-bg flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminThemeProvider>
  );
}
