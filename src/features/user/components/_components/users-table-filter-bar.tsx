import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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
  const activeFilterCount =
    Number(statusFilter !== "ALL") + Number(certificateFilter !== "ALL");
  const changeStatus = (value: string) =>
    onStatusFilterChange(
      statusFilter === value && value !== "ALL" ? "ALL" : value
    );
  const changeCertificate = (value: string) =>
    onCertificateFilterChange(
      certificateFilter === value && value !== "ALL" ? "ALL" : value
    );

  return (
    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
      <div className="relative col-span-2 min-w-0 sm:col-span-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Rechercher les comptes USER"
          placeholder="Nom, email ou matricule"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-h-11 bg-background pl-9"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-h-11 justify-start gap-2 px-3 sm:justify-center"
            aria-label={`Filtres${activeFilterCount ? `, ${activeFilterCount} actifs` : ""}`}
          >
            <Filter aria-hidden="true" data-icon="inline-start" />
            Filtres
            {activeFilterCount ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {activeFilterCount}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Statut du compte</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={statusFilter === "ALL"}
            onCheckedChange={() => changeStatus("ALL")}
          >
            Tous les comptes
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilter === "ACTIF"}
            onCheckedChange={() => changeStatus("ACTIF")}
          >
            Actifs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilter === "INACTIF"}
            onCheckedChange={() => changeStatus("INACTIF")}
          >
            Inactifs
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Certificat</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={certificateFilter === "ALL"}
            onCheckedChange={() => changeCertificate("ALL")}
          >
            Tous les certificats
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={certificateFilter === "NON_DEMANDE"}
            onCheckedChange={() => changeCertificate("NON_DEMANDE")}
          >
            Non demandé
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={certificateFilter === "EN_ATTENTE"}
            onCheckedChange={() => changeCertificate("EN_ATTENTE")}
          >
            À vérifier
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={certificateFilter === "APPROUVE"}
            onCheckedChange={() => changeCertificate("APPROUVE")}
          >
            Approuvé
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={certificateFilter === "REJETE"}
            onCheckedChange={() => changeCertificate("REJETE")}
          >
            Rejeté
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <Button
            variant="ghost"
            size="sm"
            className="min-h-9 w-full justify-start px-2"
            onClick={() => {
              onStatusFilterChange("ALL");
              onCertificateFilterChange("ALL");
            }}
            disabled={activeFilterCount === 0}
          >
            Réinitialiser les filtres
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <p
        className="flex min-h-11 items-center justify-end text-sm text-muted-foreground"
        aria-live="polite"
      >
        <span className="font-medium text-foreground">{totalResults}</span>
        <span className="ml-1">résultat{totalResults === 1 ? "" : "s"}</span>
      </p>
    </div>
  );
}
