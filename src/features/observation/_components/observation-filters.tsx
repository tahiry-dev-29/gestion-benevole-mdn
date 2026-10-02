"use client";

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
  onFilterUserChange,
  onFilterMoisChange,
  onFilterAnneeChange,
  onRefresh,
}: ObservationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2">
      <Select
        value={filterUserId ? String(filterUserId) : "all"}
        onValueChange={(v) => {
          onFilterUserChange(
            typeof v === "string" && v !== "all" ? parseInt(v, 10) : undefined
          );
        }}
      >
        <SelectTrigger className="h-9 w-[190px]">
          <SelectValue placeholder="Tous les bénévoles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les bénévoles</SelectItem>
          {benevoles.map((b) => (
            <SelectItem key={b.id} value={String(b.id)}>
              {b.prenom} {b.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filterMois ? String(filterMois) : "all"}
        onValueChange={(v) => {
          onFilterMoisChange(
            typeof v === "string" && v !== "all" ? parseInt(v, 10) : undefined
          );
        }}
      >
        <SelectTrigger className="h-9 w-[150px]">
          <SelectValue placeholder="Tous les mois" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les mois</SelectItem>
          {MONTHS.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {MOIS_LABELS[m]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filterAnnee ? String(filterAnnee) : "all"}
        onValueChange={(v) => {
          onFilterAnneeChange(
            typeof v === "string" && v !== "all" ? parseInt(v, 10) : undefined
          );
        }}
      >
        <SelectTrigger className="h-9 w-[105px]">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto">
        <CreateObservationDialog benevoles={benevoles} onCreated={onRefresh} />
      </div>
    </div>
  );
}
