import { Search } from "lucide-react";

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
  statusFilter: string;
  onStatusFilterChange: (val: string | null) => void;
  certificateFilter: string;
  onCertificateFilterChange: (val: string | null) => void;
  totalResults: number;
}

export function UsersTableFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  certificateFilter,
  onCertificateFilterChange,
  totalResults,
}: UsersTableFilterBarProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border bg-card p-2 sm:flex-row sm:items-center">
      <div className="relative min-w-48 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Rechercher les comptes USER"
          placeholder="Rechercher par nom, email, contact..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 border-transparent bg-muted/50 pl-9 focus-visible:border-input"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={certificateFilter}
          onValueChange={onCertificateFilterChange}
        >
          <SelectTrigger
            className="h-9 w-[160px]"
            aria-label="Filtrer par certificat"
          >
            <SelectValue placeholder="Certificat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous certificats</SelectItem>
            <SelectItem value="NON_DEMANDE">Non demandé</SelectItem>
            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
            <SelectItem value="APPROUVE">Approuvé</SelectItem>
            <SelectItem value="REJETE">Rejeté</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger
            className="h-9 w-[130px]"
            aria-label="Filtrer par statut du compte"
          >
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous statuts</SelectItem>
            <SelectItem value="ACTIF">Actif</SelectItem>
            <SelectItem value="INACTIF">Inactif</SelectItem>
          </SelectContent>
        </Select>

        <div
          className="whitespace-nowrap px-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <span className="font-medium text-foreground">{totalResults}</span>{" "}
          résultats
        </div>
      </div>
    </div>
  );
}
