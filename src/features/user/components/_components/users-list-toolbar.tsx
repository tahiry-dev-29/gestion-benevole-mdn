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
    <div className="relative w-full pr-10">
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
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 size-8 -translate-y-1/2"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Actualiser les comptes USER"
        title="Actualiser"
      >
        <RefreshCw className={isRefreshing ? "animate-spin" : undefined} />
      </Button>
    </div>
  );
}
