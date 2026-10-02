"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createObservationAction } from "@/features/observation/observation.action";
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
} from "@/features/observation/observation.constants";
import {
  type CreateObservationInput,
  createObservationSchema,
} from "@/features/observation/observation.schema";

import { PeriodSelects } from "./period-selects";

interface User {
  id: number;
  nom: string;
  prenom: string;
}

interface CreateObservationDialogProps {
  benevoles: User[];
  onCreated: () => void;
}

export function CreateObservationDialog({
  benevoles,
  onCreated,
}: CreateObservationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const createObservation = useMutation({
    mutationFn: async (values: CreateObservationInput) => {
      const result = await createObservationAction(values);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const [charCount, setCharCount] = React.useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateObservationInput>({
    resolver: zodResolver(createObservationSchema),
    defaultValues: {
      mois: CURRENT_MONTH,
      annee: CURRENT_YEAR,
      contenu: "",
    },
  });

  async function onSubmit(values: CreateObservationInput) {
    try {
      await createObservation.mutateAsync(values);
      toast.success("Observation enregistrée");
      reset();
      setCharCount(0);
      setOpen(false);
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la création"
      );
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PenLine className="size-4" />
        Ajouter une observation
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="size-5" />
              Nouvelle observation mensuelle
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Bénévole</Label>
              <Select
                onValueChange={(val) => {
                  if (typeof val === "string") {
                    setValue("userId", parseInt(val, 10), {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bénévole" />
                </SelectTrigger>
                <SelectContent>
                  {benevoles.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.prenom} {b.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.userId && (
                <p className="text-xs text-destructive">
                  {errors.userId.message}
                </p>
              )}
            </div>

            <PeriodSelects
              onMoisChange={(m) =>
                setValue("mois", m, { shouldValidate: true })
              }
              onAnneeChange={(y) =>
                setValue("annee", y, { shouldValidate: true })
              }
            />

            <div className="space-y-1">
              <Label htmlFor="contenu">
                Observation{" "}
                <span className="text-xs text-muted-foreground">
                  ({charCount}/1000)
                </span>
              </Label>
              <textarea
                id="contenu"
                rows={4}
                maxLength={1000}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Notes sur le bénévole ce mois..."
                {...register("contenu", {
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setCharCount(e.target.value.length);
                  },
                })}
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
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createObservation.isPending}
                className={createObservation.isPending ? "gap-2" : undefined}
              >
                {createObservation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
