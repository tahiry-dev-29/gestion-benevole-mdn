"use client";

import { Filter, RefreshCw, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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
  const activeFilterCount =
    Number(roleFilter !== ALL) + Number(statutFilter !== ALL);

  return (
    <div className="glass-sm grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl p-3">
      <div className="relative min-w-48 max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Rechercher parmi les bénévoles"
          placeholder="Rechercher par nom, email..."
          className="min-h-11 pl-8"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-h-11 gap-2"
            aria-label={`Filtres${activeFilterCount ? `, ${activeFilterCount} actifs` : ""}`}
          >
            <Filter data-icon="inline-start" aria-hidden="true" />
            Filtres
            {activeFilterCount ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {activeFilterCount}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Rôle</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={roleFilter === ALL}
            onCheckedChange={() => onRoleFilterChange(ALL)}
          >
            Tous les rôles
          </DropdownMenuCheckboxItem>
          {VOLUNTEER_ROLES.map((role) => (
            <DropdownMenuCheckboxItem
              key={role}
              checked={roleFilter === role}
              onCheckedChange={() =>
                onRoleFilterChange(roleFilter === role ? ALL : role)
              }
            >
              {roleLabel(role)}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Statut</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={statutFilter === ALL}
            onCheckedChange={() => onStatutFilterChange(ALL)}
          >
            Tous les statuts
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statutFilter === "ACTIF"}
            onCheckedChange={() =>
              onStatutFilterChange(statutFilter === "ACTIF" ? ALL : "ACTIF")
            }
          >
            Actifs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statutFilter === "INACTIF"}
            onCheckedChange={() =>
              onStatutFilterChange(statutFilter === "INACTIF" ? ALL : "INACTIF")
            }
          >
            Inactifs
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="min-h-9"
            disabled={!hasActiveFilters}
            onSelect={onResetFilters}
          >
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Réinitialiser
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="col-span-2 text-sm text-muted-foreground sm:col-span-1 sm:justify-self-end">
        <span className="font-semibold text-foreground">{total}</span>{" "}
        {total > 1 ? "bénévoles" : "bénévole"}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="col-start-2 size-11 justify-self-end shadow-xs"
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
