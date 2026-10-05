"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { isRole } from "@/lib/rbac";

import { adminNavGroups } from "./admin.data";
import { GestionGroup } from "./gestion-group";

function isActive(pathname: string, url: string) {
  return url === "/admin/dashboard"
    ? pathname === "/admin/dashboard"
    : pathname.startsWith(url);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const sessionRole = session?.user?.role;
  const role: Role | undefined = isRole(sessionRole) ? sessionRole : undefined;
  const email = session?.user?.email ?? "";
  const currentUser = {
    name: session?.user?.name || email || "Utilisateur",
    email,
    avatar: session?.user?.image ?? "",
  };

  const groups = adminNavGroups
    .map((group) => ({
      label: group.label,
      items: group.items
        .filter(
          (item) =>
            !item.roles || (role !== undefined && item.roles.includes(role))
        )
        .map((item) => {
          const children = item.items?.filter(
            (child) =>
              !child.roles || (role !== undefined && child.roles.includes(role))
          );
          const activeChildUrl = children?.find((child) =>
            isActive(pathname, child.url)
          )?.url;
          return {
            ...item,
            items: children,
            isActive: children?.length
              ? Boolean(activeChildUrl)
              : isActive(pathname, item.url),
            activeChildUrl: children?.length ? (activeChildUrl ?? null) : null,
          };
        })
        .filter((item) => !item.items || item.items.length > 0),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-full transition-colors"
    >
      <SidebarHeader className="border-b border-sidebar-border/40 pb-3 group-data-[collapsible=icon]:px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent cursor-default"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-card border border-border shadow-xs shrink-0 overflow-hidden group-data-[collapsible=icon]:size-8">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold tracking-tight text-foreground text-sm">
                  Gestion Bénévole
                </span>
                <span className="truncate text-xs text-muted-foreground font-normal">
                  Espace administration
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-1 px-2 py-2 overflow-y-auto overscroll-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sidebar-border [&::-webkit-scrollbar-track]:bg-transparent">
        <GestionGroup />
        {groups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/40 p-2 group-data-[collapsible=icon]:px-0">
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
