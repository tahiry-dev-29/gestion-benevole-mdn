"use client";

import { signOut } from "next-auth/react";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserDropdown({
  user,
}: {
  user?: { name: string; email: string; avatar?: string };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="w-9 h-9 border border-slate-700">
          <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
          <AvatarFallback className="bg-sky-500/20 text-sky-400 font-semibold">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-slate-900 border-slate-800 text-slate-200"
      >
        <DropdownMenuLabel>
          <div className="font-medium text-white">
            {user?.name || "Mon Compte"}
          </div>
          <div className="text-xs text-slate-400 font-normal">
            {user?.email || "user@example.com"}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
          <User className="w-4 h-4 mr-2" /> Profil
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
          <Settings className="w-4 h-4 mr-2" /> Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem
          className="focus:bg-slate-800 cursor-pointer text-red-400"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" /> Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
