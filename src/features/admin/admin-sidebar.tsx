"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { adminNavGroups } from "./admin.data";

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 px-5",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
          <Package className="size-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">
              Gestion Benevole
            </span>
            <span className="block text-xs text-muted-foreground">
              Espace administration
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {adminNavGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-primary" />
                  )}
                  <item.icon
                    className={cn(
                      "size-4 shrink-0 transition-transform group-hover:scale-105",
                      active && "text-primary"
                    )}
                  />
                  {!collapsed && item.title}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              MD
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">Marie Dupont</p>
              <p className="truncate text-xs text-muted-foreground">
                Administratrice
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
