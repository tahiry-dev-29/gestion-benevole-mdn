"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  activeChildUrl?: string | null;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
};

function HoverDropdownItem({ item }: { item: NavItem }) {
  const { isMobile, state } = useSidebar();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const isCollapsed = state === "collapsed";

  const openMenu = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const closeMenu = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            isActive={item.isActive}
            tooltip={item.title}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
            )}
          >
            {item.icon && <item.icon className="size-4 shrink-0" />}
            <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            <ChevronRight className="ml-auto size-3.5 opacity-60 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? "bottom" : "right"}
          align="start"
          sideOffset={10}
          className="w-56 rounded-xl border border-sidebar-border/80 bg-popover/95 p-1.5 shadow-xl backdrop-blur-md"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          {item.items?.map((subItem) => {
            const isSubActive =
              subItem.isActive ?? item.activeChildUrl === subItem.url;
            return (
              <DropdownMenuItem key={subItem.url} asChild className="p-0">
                <Link
                  href={subItem.url}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors cursor-pointer",
                    isSubActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-xs"
                      : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  {subItem.icon && (
                    <subItem.icon
                      className={cn(
                        "size-4 shrink-0",
                        isSubActive
                          ? "text-sidebar-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                  )}
                  <span className="truncate">{subItem.title}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function NavMain({
  items,
  label = "Navigation",
}: {
  items: NavItem[];
  label?: string;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup className="py-1">
      <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/75 px-3 py-1.5 h-auto">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length ? (
            <SidebarMenuItem key={item.title}>
              <HoverDropdownItem item={item} />
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  item.isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="size-4 shrink-0" />}
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
