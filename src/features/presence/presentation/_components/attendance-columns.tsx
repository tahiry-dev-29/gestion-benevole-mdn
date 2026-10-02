import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { PresenceRecord } from "../../presence.schema";

const STATUS_LABELS: Record<string, string> = {
  PRESENT: "Présent",
  RETARD: "En retard",
  ABSENT: "Absent",
};

export function createAttendanceColumns(
  onEdit: (record: PresenceRecord) => void
): ColumnDef<PresenceRecord>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "benevole",
      header: "Bénévole",
    },
    {
      id: "place",
      header: "Place",
      cell: ({ row }) =>
        row.original.tableNumber
          ? `Table ${row.original.tableNumber} · Siège ${row.original.seatNumber}`
          : "Aucune place",
    },
    {
      accessorKey: "heure_arrivee",
      header: "Arrivée",
      cell: ({ row }) => row.original.heure_arrivee ?? "—",
    },
    {
      accessorKey: "heure_depart",
      header: "Départ",
      cell: ({ row }) => row.original.heure_depart ?? "—",
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.statut;
        return (
          <Badge
            variant={
              status === "ABSENT"
                ? "destructive"
                : status === "RETARD"
                  ? "secondary"
                  : "default"
            }
          >
            {STATUS_LABELS[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          onClick={() => onEdit(row.original)}
          aria-label={`Modifier le pointage de ${row.original.benevole} du ${row.original.date}`}
          title="Modifier le pointage"
        >
          <Pencil aria-hidden="true" className="size-4" />
        </Button>
      ),
    },
  ];
}
