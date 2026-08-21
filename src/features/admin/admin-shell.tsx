"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminThemeProvider } from "./admin-theme";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-screen">
      <AdminThemeProvider>
        <AdminSidebar />

        <SidebarInset className="flex h-full flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </AdminThemeProvider>
    </SidebarProvider>
  );
}
