"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronsUpDown, FolderClosed } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { adminGestionItems } from "./admin.data"

function isActive(pathname: string, url: string) {
  return url === "/admin" ? pathname === "/admin" : pathname.startsWith(url)
}

export function GestionGroup() {
  const { state } = useSidebar()
  const pathname = usePathname()

  const activeItem = adminGestionItems.find((item) => isActive(pathname, item.url))
  const isCollapsed = state === "collapsed"

  if (isCollapsed) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Gestion</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  isActive={Boolean(activeItem)}
                  tooltip="Gestion"
                  className="justify-center"
                >
                  <FolderClosed />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={4}
                className="w-56 rounded-lg"
              >
                {adminGestionItems.map((item) => (
                  <DropdownMenuItem key={item.url} asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "cursor-pointer gap-2",
                        isActive(pathname, item.url) &&
                          "bg-accent font-medium text-accent-foreground"
                      )}
                    >
                      {item.icon && (
                        <item.icon className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="font-medium text-muted-foreground">
                    Tout afficher
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gestion</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                isActive={Boolean(activeItem)}
                tooltip="Gestion"
              >
                <FolderClosed />
                <span>Gestion</span>
                <ChevronsUpDown className="ml-auto size-4 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              sideOffset={4}
              className="w-56 rounded-lg"
            >
              {adminGestionItems.map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "cursor-pointer gap-2",
                      isActive(pathname, item.url) &&
                        "bg-accent font-medium text-accent-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="font-medium text-muted-foreground">
                  Tout afficher
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}