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
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

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
        <DropdownMenuTrigger>
          <SidebarMenuButton
            isActive={item.isActive}
            tooltip={item.title}
            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-2"
          >
            {item.icon && <item.icon />}
            <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? "bottom" : "right"}
          align="start"
          sideOffset={8}
          className="w-56 rounded-lg"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          {item.items?.map((subItem) => (
            <DropdownMenuItem key={subItem.url} asChild>
              <Link
                href={subItem.url}
                className={cn(
                  "cursor-pointer gap-2",
                  (subItem.isActive ?? item.activeChildUrl === subItem.url) &&
                    "bg-accent font-medium text-accent-foreground"
                )}
              >
                {subItem.icon && (
                  <subItem.icon className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span>{subItem.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
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
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
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
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
