"use client"

import { type ReactNode, useEffect } from "react"

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
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}