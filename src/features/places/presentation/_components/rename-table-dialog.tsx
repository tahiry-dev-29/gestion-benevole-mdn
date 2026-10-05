"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RenameTableDialogProps = {
  tableNumber: number | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newNumber: number) => void;
  isPending?: boolean;
};

export function RenameTableDialog({
  tableNumber,
  onOpenChange,
  onConfirm,
  isPending,
}: RenameTableDialogProps) {
  return (
    <Dialog open={tableNumber !== null} onOpenChange={onOpenChange}>
      {tableNumber !== null ? (
        <RenameTableForm
          key={tableNumber}
          tableNumber={tableNumber}
          onOpenChange={onOpenChange}
          onConfirm={onConfirm}
          isPending={isPending}
        />
      ) : null}
    </Dialog>
  );
}

function RenameTableForm({
  tableNumber,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  tableNumber: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newNumber: number) => void;
  isPending?: boolean;
}) {
  const [value, setValue] = React.useState(String(tableNumber));
  const [error, setError] = React.useState<string | null>(null);

  function submit() {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      setError("Saisissez un numéro de table valide.");
      return;
    }
    if (parsed === tableNumber) {
      setError("Le nouveau numéro doit être différent.");
      return;
    }
    setError(null);
    onConfirm(parsed);
  }

  return (
    <DialogContent className="glass-xl">
      <DialogHeader>
        <DialogTitle>Renommer la table {tableNumber}</DialogTitle>
        <DialogDescription>
          Choisissez un numéro de table libre.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rename-table-number">Nouveau numéro</Label>
        <Input
          id="rename-table-number"
          type="number"
          min="1"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={error !== null}
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Annuler
        </Button>
        <Button onClick={submit} disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Renommer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
