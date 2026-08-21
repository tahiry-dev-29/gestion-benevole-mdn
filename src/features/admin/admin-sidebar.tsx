"use client"

import { usePathname } from "next/navigation"
import { Package } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { adminNavGroups, adminUser } from "./admin.data"
import { GestionGroup } from "./gestion-group"

function isActive(pathname: string, url: string) {
  return url === "/admin" ? pathname === "/admin" : pathname.startsWith(url)
}

export function AdminSidebar() {
  const pathname = usePathname()

  const groups = adminNavGroups.map((group) => ({
    label: group.label,
    items: group.items.map((item) => {
      const activeChildUrl = item.items?.find((child) =>
        isActive(pathname, child.url)
      )?.url;
      return {
        ...item,
        isActive: item.items?.length
          ? Boolean(activeChildUrl)
          : isActive(pathname, item.url),
        activeChildUrl: item.items?.length ? activeChildUrl ?? null : null,
      };
    }),
  }))

  return (
    <Sidebar collapsible="icon" className="bg-card border-r h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Package className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Gestion Bénévole</span>
                <span className="truncate text-xs">Espace administration</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto overscroll-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
        <GestionGroup />
        {groups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}