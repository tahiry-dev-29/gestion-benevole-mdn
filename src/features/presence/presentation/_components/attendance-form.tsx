import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SeatGrid } from "@/features/places/places.schema";

const STATUS_LABELS: Record<string, string> = {
  PRESENT: "Présent",
  RETARD: "Retard",
  ABSENT: "Absent",
};

export type PointageFormState = {
  userId: string;
  tableNumber: string;
  seatId: string;
  status: string;
  arrivee: string;
  depart: string;
};

type AttendanceFormProps = {
  volunteers: { id: number; nom: string; prenom: string }[];
  tables: SeatGrid[];
  busySeatIds: Set<number>;
  value: PointageFormState;
  isPending: boolean;
  onChange: (patch: Partial<PointageFormState>) => void;
  onSubmit: () => void;
};

/**
 * Formulaire de pointage : bénévole, puis table, puis siège.
 * Les sièges déjà occupés à la date choisie restent sélectionnables visuellement
 * mais désactivés, l'unicité `(seat_id, date)` restant garantie en base.
 */
export function AttendanceForm({
  volunteers,
  tables,
  busySeatIds,
  value,
  isPending,
  onChange,
  onSubmit,
}: AttendanceFormProps) {
  const selectedTable = tables.find(
    (table) => String(table.tableNumber) === value.tableNumber
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pointer un bénévole</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Select
          value={value.userId}
          onValueChange={(next) => onChange({ userId: next ?? "" })}
        >
          <SelectTrigger>
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
        <Select
          value={value.tableNumber}
          onValueChange={(next) =>
            onChange({ tableNumber: next ?? "", seatId: "" })
          }
        >
          <SelectTrigger>
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
        <Select
          value={value.seatId}
          onValueChange={(next) => onChange({ seatId: next ?? "" })}
          disabled={!value.tableNumber}
        >
          <SelectTrigger>
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
        <Select
          value={value.status}
          onValueChange={(next) => onChange({ status: next ?? "PRESENT" })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([code, label]) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="time"
          aria-label="Heure d’arrivée"
          value={value.arrivee}
          onChange={(event) => onChange({ arrivee: event.target.value })}
        />
        <div className="flex gap-2">
          <Input
            type="time"
            aria-label="Heure de départ"
            value={value.depart}
            onChange={(event) => onChange({ depart: event.target.value })}
          />
          <Button onClick={onSubmit} disabled={isPending}>
            Pointer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
