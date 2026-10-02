"use client";

import { RefreshCw, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { VOLUNTEER_ROLES } from "../../volunteer.schema";
import { roleLabel } from "../labels";

interface VolunteersTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string | null) => void;
  statutFilter: string;
  onStatutFilterChange: (value: string | null) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  total: number;
  isFetching: boolean;
  onRefetch: () => void;
}

const ALL = "ALL";

export function VolunteersTableToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statutFilter,
  onStatutFilterChange,
  onResetFilters,
  hasActiveFilters,
  total,
  isFetching,
  onRefetch,
}: VolunteersTableToolbarProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border bg-card p-2 shadow-xs">
      <div className="relative min-w-48 max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher par nom, email..."
          className="h-9 pl-8"
        />
      </div>
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="h-9 w-[160px]" aria-label="Filtrer par rôle">
          <SelectValue placeholder="Rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous les rôles</SelectItem>
          {VOLUNTEER_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {roleLabel(role)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statutFilter} onValueChange={onStatutFilterChange}>
        <SelectTrigger
          className="h-9 w-[145px]"
          aria-label="Filtrer par statut du compte"
        >
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous les statuts</SelectItem>
          <SelectItem value="ACTIF">Actif</SelectItem>
          <SelectItem value="INACTIF">Inactif</SelectItem>
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={onResetFilters}
          aria-label="Effacer les filtres"
          title="Effacer les filtres"
        >
          <RotateCcw className="size-3.5" />
          Réinitialiser
        </Button>
      )}
      <span className="ml-auto whitespace-nowrap px-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{total}</span>{" "}
        {total > 1 ? "bénévoles" : "bénévole"}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="size-9 shadow-xs"
        onClick={onRefetch}
        disabled={isFetching}
        aria-label="Actualiser la liste des bénévoles"
        title="Actualiser"
      >
        <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
      </Button>
    </div>
  );
}
