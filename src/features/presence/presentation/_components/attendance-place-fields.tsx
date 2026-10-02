import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeatGrid } from "@/features/places/places.schema";

import type { PointageFormState } from "./attendance-form.types";

type AttendancePlaceFieldsProps = {
  volunteers: { id: number; nom: string; prenom: string }[];
  tables: SeatGrid[];
  busySeatIds: Set<number>;
  value: PointageFormState;
  onChange: (patch: Partial<PointageFormState>) => void;
};

export function AttendancePlaceFields({
  volunteers,
  tables,
  busySeatIds,
  value,
  onChange,
}: AttendancePlaceFieldsProps) {
  const selectedTable = tables.find(
    (table) => String(table.tableNumber) === value.tableNumber
  );

  return (
    <>
      <div className="space-y-2 xl:col-span-2">
        <Label htmlFor="attendance-volunteer">Bénévole</Label>
        <Select
          value={value.userId}
          onValueChange={(next) => onChange({ userId: next ?? "" })}
        >
          <SelectTrigger
            id="attendance-volunteer"
            disabled={!volunteers.length}
          >
            <SelectValue placeholder="Bénévole" />
          </SelectTrigger>
          <SelectContent>
            {volunteers.map((person) => (
              <SelectItem key={person.id} value={String(person.id)}>
                {person.prenom} {person.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="attendance-table">Table</Label>
        <Select
          value={value.tableNumber}
          onValueChange={(next) =>
            onChange({ tableNumber: next ?? "", seatId: "" })
          }
        >
          <SelectTrigger id="attendance-table" disabled={!tables.length}>
            <SelectValue placeholder="Table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem
                key={table.tableNumber}
                value={String(table.tableNumber)}
              >
                Table {table.tableNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="attendance-seat">Siège</Label>
        <Select
          value={value.seatId}
          onValueChange={(next) => onChange({ seatId: next ?? "" })}
          disabled={!value.tableNumber}
        >
          <SelectTrigger id="attendance-seat">
            <SelectValue placeholder="Siège" />
          </SelectTrigger>
          <SelectContent>
            {selectedTable?.seats.map((seat) => (
              <SelectItem
                key={seat.id}
                value={String(seat.id)}
                disabled={busySeatIds.has(seat.id)}
              >
                Siège {seat.seatNumber}
                {busySeatIds.has(seat.id) ? " · occupé" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
