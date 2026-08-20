"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LogOut,
  Menu,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";

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

import { adminNav } from "./admin.data";
import { useSidebar } from "./admin-shell";
import { AdminSidebar } from "./admin-sidebar";
import { ThemeToggle } from "./theme-toggle";

function useCurrentTitle() {
  const pathname = usePathname();
  const match = adminNav.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href)
  );
  return match?.title ?? "Administration";
}

export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const title = useCurrentTitle();
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-card/50 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="Réduire le menu"
          onClick={toggle}
          className="hidden md:inline-flex"
        >
          <PanelLeft className="size-4" />
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Ouvrir le menu"
                className="md:hidden"
              />
            }
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation administrateur</SheetTitle>
            </SheetHeader>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block h-full"
            >
              <AdminSidebar />
            </Link>
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
          nativeButton={false}
          render={<Link href="/" />}
          className="hidden sm:inline-flex"
        >
          <ExternalLink className="size-4" />
          Retour au site
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu du compte"
                className="rounded-full"
              />
            }
          >
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                MD
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Marie Dupont
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  marie.dupont@asso.fr
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
