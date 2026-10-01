import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PresenceRecord } from "../../presence.schema";

type AttendanceTableProps = {
  rows: PresenceRecord[];
  isPending: boolean;
};

/** Historique des pointages de la période sélectionnée. */
export function AttendanceTable({ rows, isPending }: AttendanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique ({rows.length})</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bénévole</TableHead>
              <TableHead>Place</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead>Départ</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.benevole}</TableCell>
                  <TableCell>
                    {row.tableNumber
                      ? `T${row.tableNumber} · S${row.seatNumber}`
                      : "—"}
                  </TableCell>
                  <TableCell>{row.heure_arrivee ?? "—"}</TableCell>
                  <TableCell>{row.heure_depart ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.statut === "PRESENT" ? "default" : "secondary"
                      }
                    >
                      {row.statut}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-20 text-center text-muted-foreground"
                >
                  {isPending
                    ? "Chargement…"
                    : "Aucun pointage sur cette période."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
