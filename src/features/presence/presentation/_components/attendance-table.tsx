import { DataTable } from "@/components/shared/data-table";
import type { SeatGrid } from "@/features/places/places.schema";

import type { PresenceRecord } from "../../presence.schema";
import type { AttendanceFilters } from "../use-attendance";

import { createAttendanceColumns } from "./attendance-columns";
import { AttendanceFiltersBar } from "./attendance-filters";

type AttendanceTableProps = {
  rows: PresenceRecord[];
  isPending: boolean;
  tables: SeatGrid[];
  filters: AttendanceFilters;
  onFiltersChange: (filters: AttendanceFilters) => void;
  isFetching: boolean;
  onRefresh: () => void;
  onEdit: (record: PresenceRecord) => void;
};

export function AttendanceTable({
  rows,
  isPending,
  tables,
  filters,
  onFiltersChange,
  isFetching,
  onRefresh,
  onEdit,
}: AttendanceTableProps) {
  return (
    <section aria-labelledby="attendance-history-heading" className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="attendance-history-heading" className="text-lg font-semibold">
          Historique des pointages
        </h2>
        <p className="text-sm text-muted-foreground">
          {rows.length} résultat{rows.length === 1 ? "" : "s"}
        </p>
      </div>
      <DataTable
        columns={createAttendanceColumns(onEdit)}
        data={rows}
        isLoading={isPending}
        toolbar={
          <AttendanceFiltersBar
            tables={tables}
            value={filters}
            onChange={onFiltersChange}
            isFetching={isFetching}
            onRefresh={onRefresh}
          />
        }
        emptyMessage="Aucun pointage ne correspond à ces filtres."
      />
    </section>
  );
}
