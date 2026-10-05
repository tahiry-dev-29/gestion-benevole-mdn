import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UsersTableFilterBar } from "./users-table-filter-bar";

export function UsersListToolbar({
  total,
  search,
  status,
  certificate,
  onSearchChange,
  onStatusChange,
  onCertificateChange,
  onRefresh,
  isRefreshing,
}: {
  total: number;
  search: string;
  status: string;
  certificate: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  onCertificateChange: (value: string | null) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <section
      aria-label="Recherche et filtres"
      className="glass-sm rounded-lg border bg-card p-3"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <UsersTableFilterBar
          search={search}
          onSearchChange={onSearchChange}
          statusFilter={status}
          onStatusFilterChange={onStatusChange}
          certificateFilter={certificate}
          onCertificateFilterChange={onCertificateChange}
          totalResults={total}
        />
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 min-w-11 shrink-0 gap-2 self-end lg:self-auto"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Actualiser les comptes USER"
        >
          <RefreshCw
            aria-hidden="true"
            className={isRefreshing ? "animate-spin" : "size-4"}
          />
          <span className="sr-only lg:not-sr-only">Actualiser</span>
        </Button>
      </div>
    </section>
  );
}
