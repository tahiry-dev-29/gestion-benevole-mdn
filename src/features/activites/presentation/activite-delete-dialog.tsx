"use client";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

import type { Activite } from "../domain/activite.entity";

type Props = {
  target: Activite | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ActiviteDeleteDialog({
  target,
  isPending,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <ConfirmDeleteDialog
      open={target !== null}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isPending={isPending}
      title={`Supprimer « ${target?.titre} » ?`}
    />
  );
}
