"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AdminShell } from "./admin-shell";

export function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
