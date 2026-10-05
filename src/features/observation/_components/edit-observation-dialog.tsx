"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOIS_LABELS } from "@/features/observation/observation.constants";
import type { ObservationItem } from "@/features/observation/observation-queries.action";
import { useUpdateObservation } from "@/features/observation/use-observations";

const editSchema = z.object({
  contenu: z
    .string()
    .min(5, "Le contenu doit comporter au moins 5 caractères")
    .max(1000, "Le contenu ne doit pas dépasser 1000 caractères"),
});

type EditValues = z.infer<typeof editSchema>;

interface EditObservationDialogProps {
  observation: ObservationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditObservationDialog({
  observation,
  open,
  onOpenChange,
}: EditObservationDialogProps) {
  const updateObservation = useUpdateObservation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    values: {
      contenu: observation?.contenu ?? "",
    },
  });

  const contenuValue = watch("contenu") || "";

  async function onSubmit(values: EditValues) {
    if (!observation) return;
    try {
      await updateObservation.mutateAsync({
        observationId: observation.id,
        contenu: values.contenu,
      });
      toast.success("Observation mise à jour");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur de mise à jour"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-5" />
            Modifier l&apos;observation
          </DialogTitle>
        </DialogHeader>

        {observation ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-semibold text-foreground">
                {observation.benevole}
              </span>{" "}
              — {MOIS_LABELS[observation.mois]} {observation.annee}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-contenu">Observation</Label>
                <span className="text-xs text-muted-foreground">
                  ({contenuValue.length}/1000)
                </span>
              </div>
              <Textarea
                id="edit-contenu"
                rows={5}
                maxLength={1000}
                className="resize-none"
                placeholder="Notes sur le bénévole..."
                {...register("contenu")}
              />
              {errors.contenu && (
                <p className="text-xs text-destructive">
                  {errors.contenu.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={updateObservation.isPending}
                className={updateObservation.isPending ? "gap-2" : undefined}
              >
                {updateObservation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
