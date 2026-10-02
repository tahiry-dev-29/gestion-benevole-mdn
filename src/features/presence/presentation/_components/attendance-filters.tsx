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
import type { SeatGrid } from "@/features/places/places.schema";

import type { AttendanceFilters } from "../use-attendance";

type AttendanceFiltersProps = {
  tables: SeatGrid[];
  value: AttendanceFilters;
  onChange: (filters: AttendanceFilters) => void;
  isFetching: boolean;
  onRefresh: () => void;
};

export function AttendanceFiltersBar({
  tables,
  value,
  onChange,
  isFetching,
  onRefresh,
}: AttendanceFiltersProps) {
  const hasFilters = Boolean(
    value.query || value.statut !== "ALL" || value.seatId
  );

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_10rem_minmax(11rem,15rem)_auto]">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Rechercher un bénévole"
          placeholder="Nom, email ou matricule"
          value={value.query}
          onChange={(event) =>
            onChange({ ...value, query: event.target.value })
          }
          className="pl-9"
        />
      </div>
      <Select
        value={value.statut}
        onValueChange={(statut) => statut && onChange({ ...value, statut })}
      >
        <SelectTrigger aria-label="Filtrer par statut">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les statuts</SelectItem>
          <SelectItem value="PRESENT">Présent</SelectItem>
          <SelectItem value="RETARD">En retard</SelectItem>
          <SelectItem value="ABSENT">Absent</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={value.seatId || "ALL"}
        onValueChange={(seatId) =>
          seatId &&
          onChange({ ...value, seatId: seatId === "ALL" ? "" : seatId })
        }
      >
        <SelectTrigger aria-label="Filtrer par place">
          <SelectValue placeholder="Toutes les places" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Toutes les places</SelectItem>
          {tables.flatMap((table) =>
            table.seats.map((seat) => (
              <SelectItem key={seat.id} value={String(seat.id)}>
                Table {table.tableNumber} · Siège {seat.seatNumber}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange({ query: "", statut: "ALL", seatId: "" })}
        disabled={!hasFilters}
        aria-label="Effacer les filtres"
        title="Effacer les filtres"
      >
        <RotateCcw aria-hidden="true" className="size-4" />
        <span className="sm:hidden">Effacer</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isFetching}
        aria-label="Actualiser les pointages"
        title="Actualiser les pointages"
      >
        <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
      </Button>
    </div>
  );
}
