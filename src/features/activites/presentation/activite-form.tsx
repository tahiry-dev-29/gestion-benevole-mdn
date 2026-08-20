"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { Activite } from "../domain/activite.entity";

const formSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(150),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
});

export type ActiviteFormValues = z.infer<typeof formSchema>;

interface ActiviteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Activite | null;
  onSubmit: (values: ActiviteFormValues) => void;
  isPending?: boolean;
}

export function ActiviteForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: ActiviteFormProps) {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActiviteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: initialData?.titre ?? "",
      description: initialData?.description ?? "",
      date: initialData?.date ? initialData.date.slice(0, 10) : "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        titre: initialData?.titre ?? "",
        description: initialData?.description ?? "",
        date: initialData?.date ? initialData.date.slice(0, 10) : "",
      });
    }
  }, [open, initialData, reset]);

  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Modifier l'activité" : "Nouvelle activité"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Mettez à jour les informations de l'activité."
              : "Renseignez les informations de la nouvelle activité."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="titre">Titre</Label>
            <Input id="titre" {...register("titre")} aria-invalid={!!errors.titre} />
            {errors.titre ? (
              <p className="text-xs text-destructive">{errors.titre.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              aria-invalid={!!errors.description}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("date")} aria-invalid={!!errors.date} />
            {errors.date ? (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            ) : null}
          </div>
        </form>

        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
