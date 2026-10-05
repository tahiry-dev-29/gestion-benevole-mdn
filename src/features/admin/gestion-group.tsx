"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { ChevronsUpDown, FolderClosed } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { isRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

import { adminGestionItems } from "./admin.data";

function isActive(pathname: string, url: string) {
  return url === "/admin" ? pathname === "/admin" : pathname.startsWith(url);
}

export function GestionGroup() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const sessionRole = session?.user?.role;
  const role: Role | undefined = isRole(sessionRole) ? sessionRole : undefined;

  const items = adminGestionItems
    .filter(
      (item) => !item.roles || (role !== undefined && item.roles.includes(role))
    )
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (child) =>
          !child.roles || (role !== undefined && child.roles.includes(role))
      ),
    }))
    .filter((item) => !item.items || item.items.length > 0);

  const activeItem = items.find((item) => isActive(pathname, item.url));

  return (
    <SidebarGroup className="py-1 group-data-[collapsible=icon]:px-0">
      <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/75 px-3 py-1.5 h-auto">
        Gestion
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="default"
                isActive={Boolean(activeItem)}
                tooltip="Gestion"
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  Boolean(activeItem)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    : "text-sidebar-foreground/90"
                )}
              >
                <FolderClosed className="size-4 shrink-0 text-sidebar-primary" />
                <span className="truncate group-data-[collapsible=icon]:hidden">
                  Gestion
                </span>
                <ChevronsUpDown className="ml-auto size-3.5 opacity-60 shrink-0 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              sideOffset={10}
              className="w-64 rounded-xl border border-sidebar-border/80 bg-popover/95 p-1.5 shadow-xl backdrop-blur-md"
            >
              <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Modules de gestion
              </div>
              {items.map((item) => {
                const itemIsActive = isActive(pathname, item.url);
                return (
                  <DropdownMenuItem key={item.url} asChild className="p-0">
                    <Link
                      href={item.url}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors cursor-pointer",
                        itemIsActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-xs"
                          : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "size-4 shrink-0",
                            itemIsActive
                              ? "text-sidebar-primary-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                      )}
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
