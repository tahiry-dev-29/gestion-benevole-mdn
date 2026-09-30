"use client";

import { useEffect, useState, useTransition } from "react";
import { CalendarDays, ChevronLeft, ChevronRight,Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getHistoriquePresencesAction } from "../presence.action";
import type { PresenceRecord } from "../presence.schema";

function statusBadge(statut: string) {
  if (statut === "PRESENT") return <Badge variant="default">Présent</Badge>;
  if (statut === "RETARD") return <Badge variant="secondary">Retard</Badge>;
  return <Badge variant="outline">Absent</Badge>;
}

function formatMinutes(minutes: number | null): string {
  if (minutes === null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

interface PresenceHistoriqueProps {
  isAdmin: boolean;
}

export function PresenceHistorique({ isAdmin }: PresenceHistoriqueProps) {
  const [isPending, startTransition] = useTransition();
  const [presences, setPresences] = useState<PresenceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const pageSize = 10;

  const fetchData = (p: number = page) => {
    startTransition(async () => {
      const res = await getHistoriquePresencesAction({
        page: p,
        pageSize,
        dateDebut: dateDebut || undefined,
        dateFin: dateFin || undefined,
      });
      if (res.success && res.data) {
        setPresences(res.data);
        setTotal(res.total ?? 0);
        setPage(p);
      }
    });
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const handleFilter = () => {
    fetchData(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="size-5" />
          Historique des présences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              placeholder="Date début"
              className="max-w-[180px]"
            />
            <span className="text-muted-foreground text-sm">→</span>
            <Input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              placeholder="Date fin"
              className="max-w-[180px]"
            />
          </div>
          <Button
            onClick={handleFilter}
            variant="secondary"
            disabled={isPending}
            className="gap-2"
          >
            <Search className="size-4" />
            Filtrer
          </Button>
        </div>

        {/* Tableau */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Bénévole</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presences.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 6 : 5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {isPending
                      ? "Chargement..."
                      : "Aucune présence trouvée."}
                  </TableCell>
                </TableRow>
              ) : (
                presences.map((p) => (
                  <TableRow key={p.id}>
                    {isAdmin && (
                      <TableCell className="font-medium">
                        {p.benevole}
                      </TableCell>
                    )}
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(p.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{p.heure_arrivee ?? "—"}</TableCell>
                    <TableCell>{p.heure_depart ?? "—"}</TableCell>
                    <TableCell>{formatMinutes(p.heuresTravaillees)}</TableCell>
                    <TableCell>{statusBadge(p.statut)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} sur {totalPages} ({total} résultat
              {total > 1 ? "s" : ""})
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(page - 1)}
                disabled={page <= 1 || isPending}
              >
                <ChevronLeft className="size-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(page + 1)}
                disabled={page >= totalPages || isPending}
              >
                Suivant
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
