"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Loader2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCredit } from "@/features/credit/use-credits";

const formSchema = z.object({
  userId: z.number().int().positive("Sélectionnez un bénévole"),
  montant: z.number().positive("Le montant doit être positif"),
  date: z.string().min(1, "La date est requise"),
  motif: z.string().min(2, "Le motif est requis").max(255),
});

type FormValues = z.infer<typeof formSchema>;

interface User {
  id: number;
  nom: string;
  prenom: string;
}

interface CreateCreditDialogProps {
  benevoles: User[];
  onCreated: () => void;
}

export function CreateCreditDialog({
  benevoles,
  onCreated,
}: CreateCreditDialogProps) {
  const [open, setOpen] = React.useState(false);
  const createCredit = useCreateCredit();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createCredit.mutateAsync({
        userId: values.userId,
        montant: values.montant,
        date: new Date(values.date),
        motif: values.motif,
      });
      toast.success("Crédit ajouté avec succès");
      reset();
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
        <Plus className="size-4" />
        Nouveau crédit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="size-5" />
              Ajouter un crédit
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="userId">Bénévole</Label>
              <Select
                onValueChange={(val) => {
                  if (typeof val === "string") {
                    setValue("userId", parseInt(val, 10), {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger id="userId">
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

            <div className="space-y-1">
              <Label htmlFor="montant">Montant (€)</Label>
              <Input
                id="montant"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register("montant", { valueAsNumber: true })}
              />
              {errors.montant && (
                <p className="text-xs text-destructive">
                  {errors.montant.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="motif">Motif</Label>
              <Input
                id="motif"
                placeholder="Ex: Remboursement transport"
                {...register("motif")}
              />
              {errors.motif && (
                <p className="text-xs text-destructive">
                  {errors.motif.message}
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
                disabled={createCredit.isPending}
                className={createCredit.isPending ? "gap-2" : undefined}
              >
                {createCredit.isPending && (
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
