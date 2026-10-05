"use client";

import { Filter, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOIS_LABELS,
  MONTHS,
  YEARS,
} from "@/features/observation/observation.constants";

import { CreateObservationDialog } from "./create-observation-dialog";

interface User {
  id: number;
  nom: string;
  prenom: string;
}

interface ObservationFiltersProps {
  benevoles: User[];
  filterUserId?: number;
  filterMois?: number;
  filterAnnee?: number;
  isFetching?: boolean;
  onFilterUserChange: (userId?: number) => void;
  onFilterMoisChange: (mois?: number) => void;
  onFilterAnneeChange: (annee?: number) => void;
  onRefresh: () => void;
}

export function ObservationFilters({
  benevoles,
  filterUserId,
  filterMois,
  filterAnnee,
  isFetching = false,
  onFilterUserChange,
  onFilterMoisChange,
  onFilterAnneeChange,
  onRefresh,
}: ObservationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 gap-2">
            <Filter className="size-4" aria-hidden="true" />
            Filtres
            {[filterUserId, filterMois, filterAnnee].filter(Boolean).length >
            0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-xs text-primary">
                {[filterUserId, filterMois, filterAnnee].filter(Boolean).length}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 p-3">
          <DropdownMenuLabel className="px-0">
            Filtrer les observations
          </DropdownMenuLabel>
          <div className="grid gap-3 py-2">
            <Select
              value={filterUserId ? String(filterUserId) : "all"}
              onValueChange={(value) =>
                onFilterUserChange(value !== "all" ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Tous les bénévoles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les bénévoles</SelectItem>
                {benevoles.map((benevole) => (
                  <SelectItem key={benevole.id} value={String(benevole.id)}>
                    {benevole.prenom} {benevole.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterMois ? String(filterMois) : "all"}
              onValueChange={(value) =>
                onFilterMoisChange(value !== "all" ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Tous les mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les mois</SelectItem>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {MOIS_LABELS[month]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterAnnee ? String(filterAnnee) : "all"}
              onValueChange={(value) =>
                onFilterAnneeChange(value !== "all" ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Toutes les années" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DropdownMenuSeparator />
          <Button
            type="button"
            variant="ghost"
            className="mt-1 h-8 w-full justify-center"
            onClick={() => {
              onFilterUserChange(undefined);
              onFilterMoisChange(undefined);
              onFilterAnneeChange(undefined);
            }}
          >
            Réinitialiser les filtres
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        onClick={onRefresh}
        disabled={isFetching}
        aria-label="Actualiser les observations"
        title="Actualiser les observations"
      >
        <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
      </Button>

      <div className="ml-auto">
        <CreateObservationDialog benevoles={benevoles} onCreated={onRefresh} />
      </div>
    </div>
  );
}
