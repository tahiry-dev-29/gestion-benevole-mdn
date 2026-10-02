"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { SeatGrid } from "../places.schema";

import { RenameTableDialog } from "./_components/rename-table-dialog";
import { usePlaces } from "./use-places";

export function PlacesManager({
  initialTables,
}: {
  initialTables: SeatGrid[];
}) {
  const [seatCount, setSeatCount] = useState("6");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const places = usePlaces(initialTables);
  const tables = places.query.data ?? initialTables;
  const pending =
    places.createTable.isPending ||
    places.renameTable.isPending ||
    places.createSeat.isPending ||
    places.deleteSeat.isPending;

  async function run(
    action: () => Promise<unknown>,
    done: string
  ): Promise<boolean> {
    try {
      await action();
      toast.success(done);
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
      return false;
    }
  }

  function addTable() {
    void run(
      () => places.createTable.mutateAsync({ seatCount }),
      "Table ajoutée."
    );
  }

  function renameTable(newNumber: number) {
    const current = renaming;
    if (current === null) return;
    void run(
      () =>
        places.renameTable.mutateAsync({
          oldNumber: current,
          newNumber: String(newNumber),
        }),
      "Table renommée."
    ).then((success) => success && setRenaming(null));
  }

  function addSeat(tableNumber: number) {
    const highest = Math.max(
      0,
      ...(tables
        .find((table) => table.tableNumber === tableNumber)
        ?.seats.map((seat) => seat.seatNumber) ?? [])
    );
    run(
      () =>
        places.createSeat.mutateAsync({ tableNumber, seatNumber: highest + 1 }),
      "Siège ajouté."
    );
  }

  function deleteSeat() {
    if (deleting === null) return;
    void run(
      () => places.deleteSeat.mutateAsync({ seatId: deleting }),
      "Siège supprimé."
    ).then((success) => success && setDeleting(null));
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
      {places.query.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {places.query.error.message}
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.tableNumber}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Table {table.tableNumber}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRenaming(table.tableNumber)}
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
                    type="button"
                    aria-label={`Supprimer siège ${seat.seatNumber}`}
                    title={`Supprimer le siège ${seat.seatNumber}`}
                    className="ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <RenameTableDialog
        tableNumber={renaming}
        onOpenChange={(open) => !open && setRenaming(null)}
        onConfirm={renameTable}
        isPending={places.renameTable.isPending}
      />
    </div>
  );
}
