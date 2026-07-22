import React from "react";

import { Logo } from "@/components/svg/logo";
import { UserDropdown } from "@/features/user/user-dropdown";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <Logo className="w-7 h-7 text-sky-400" />
        <h1 className="text-xl font-bold text-white tracking-tight">
          Tableau de Bord Bénévole
        </h1>
      </div>
      <UserDropdown
        user={{ name: "Admin Bénévole", email: "admin@maison-numerique.fr" }}
      />
    </header>
  );
}
