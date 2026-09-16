import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersTableFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: string | null) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string | null) => void;
  totalResults: number;
}

export function UsersTableFilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  totalResults,
}: UsersTableFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="Rechercher par nom, email, contact..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-500 h-9 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-[130px] bg-slate-950/50 border-slate-800 text-slate-300 h-9 text-xs">
            <Filter className="mr-1.5 size-3.5 text-slate-400" />
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="BENEVOLE">Bénévole</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[130px] bg-slate-950/50 border-slate-800 text-slate-300 h-9 text-xs">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
            <SelectItem value="ALL">Tous statuts</SelectItem>
            <SelectItem value="ACTIF">Actif</SelectItem>
            <SelectItem value="INACTIF">Inactif</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-xs text-slate-400 whitespace-nowrap pl-2 border-l border-slate-800">
          <span className="font-semibold text-slate-200">{totalResults}</span>{" "}
          résultats
        </div>
      </div>
    </div>
  );
}
