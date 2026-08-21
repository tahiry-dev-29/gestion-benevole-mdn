"use client"

import { type ReactNode, useEffect } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"

export function AdminShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark")
    return () => {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
