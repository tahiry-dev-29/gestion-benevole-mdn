"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { ExternalLink, LogOut, Menu, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { isRole } from "@/lib/rbac";

import { MobileAdminNavigation } from "./_components/mobile-admin-navigation";
import { adminGestionItems, adminNavGroups } from "./admin.data";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, url: string) {
  return url === "/admin" ? pathname === "/admin" : pathname.startsWith(url);
}

function useCurrentTitle() {
  const pathname = usePathname();
  if (pathname === "/admin/profil") return "Mon profil";
  const item = adminNavGroups
    .flatMap((group) => group.items)
    .find((item) =>
      item.items?.length
        ? item.items.some((child) => isActive(pathname, child.url))
        : isActive(pathname, item.url)
    );
  const child = item?.items?.find((c) => isActive(pathname, c.url));
  const gestion = adminGestionItems.find((entry) =>
    entry.items?.some((link) => isActive(pathname, link.url))
  );
  const gestionChild = gestion?.items?.find((link) =>
    isActive(pathname, link.url)
  );
  return (
    item?.title ??
    child?.title ??
    gestionChild?.title ??
    gestion?.title ??
    "Administration"
  );
}

export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const title = useCurrentTitle();
  const { data: session } = useSession();
  const sessionRole = session?.user?.role;
  const role: Role | undefined = isRole(sessionRole) ? sessionRole : undefined;
  const name = session?.user?.name || session?.user?.email || "Utilisateur";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-card/50 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="hidden md:inline-flex" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Ouvrir le menu"
              className="md:hidden"
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation administrateur</SheetTitle>
            </SheetHeader>
            <MobileAdminNavigation
              role={role}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <h1 className="truncate text-base font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden sm:inline-flex"
        >
          <Link href="/">
            <ExternalLink className="size-4" />
            Retour au site
          </Link>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu du compte"
              className="rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {name}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profil">
                <User className="size-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            {role === "ADMIN" || role === "SUPER_ADMIN" ? (
              <DropdownMenuItem asChild>
                <Link href="/admin/parametres">
                  <Settings className="size-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => void signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="size-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
