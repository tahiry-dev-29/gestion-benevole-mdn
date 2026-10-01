"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  createSeatAction,
  createTableAction,
  deleteSeatAction,
  renameTableAction,
} from "../places.action";
import type { SeatGrid } from "../places.schema";

export function PlacesManager({
  initialTables,
}: {
  initialTables: SeatGrid[];
}) {
  const [tables] = useState(initialTables);
  const [seatCount, setSeatCount] = useState("6");
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<number | null>(null);

  function run(
    action: () => Promise<{ success: boolean; error?: string }>,
    done: string
  ) {
    startTransition(() => {
      void (async () => {
        const result = await action();
        if (!result.success)
          return toast.error(result.error ?? "Une erreur est survenue.");
        toast.success(done);
        window.location.reload();
      })();
    });
  }

  function addTable() {
    run(() => createTableAction({ seatCount }), "Table ajoutée.");
  }

  function renameTable(tableNumber: number) {
    const value = window.prompt("Nouveau numéro de table", String(tableNumber));
    if (value)
      run(
        () => renameTableAction({ oldNumber: tableNumber, newNumber: value }),
        "Table renommée."
      );
  }

  function addSeat(tableNumber: number) {
    const highest = Math.max(
      0,
      ...(tables
        .find((table) => table.tableNumber === tableNumber)
        ?.seats.map((seat) => seat.seatNumber) ?? [])
    );
    run(
      () => createSeatAction({ tableNumber, seatNumber: highest + 1 }),
      "Siège ajouté."
    );
  }

  function deleteSeat() {
    if (deleting === null) return;
    run(() => deleteSeatAction({ seatId: deleting }), "Siège supprimé.");
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-2 text-sm">
          Nombre de sièges
          <Input
            type="number"
            min="1"
            max="100"
            value={seatCount}
            onChange={(event) => setSeatCount(event.target.value)}
            className="w-36"
          />
        </label>
        <Button onClick={addTable} disabled={pending}>
          <Plus className="size-4" /> Ajouter une table
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.tableNumber}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Table {table.tableNumber}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => renameTable(table.tableNumber)}
                  disabled={pending}
                >
                  <Pencil className="size-4" /> Renommer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSeat(table.tableNumber)}
                  disabled={pending}
                >
                  <Plus className="size-4" /> Siège
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {table.seats.map((seat) => (
                <span
                  key={seat.id}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm ${seat.occupiedToday ? "border-amber-500 bg-amber-50 text-amber-800" : "bg-muted"}`}
                >
                  {seat.label ?? `Siège ${seat.seatNumber}`}
                  {seat.occupiedToday ? " · occupé aujourd’hui" : ""}
                  <button
                    aria-label={`Supprimer siège ${seat.seatNumber}`}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleting(seat.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </span>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      {tables.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune table. Créez la première pour commencer.
        </p>
      ) : null}
      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={deleteSeat}
        isPending={pending}
        title="Supprimer ce siège ?"
        description="Un siège utilisé dans un pointage ne peut pas être supprimé."
      />
    </div>
  );
}
