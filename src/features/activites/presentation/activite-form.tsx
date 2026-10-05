"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import {
  type CreateActiviteDto,
  createActiviteSchema,
} from "../application/activite.schema";
import type { Activite } from "../domain/activite.entity";

export type ActiviteFormValues = CreateActiviteDto;

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
    setValue,
    control,
    formState: { errors },
  } = useForm<
    z.input<typeof createActiviteSchema>,
    unknown,
    ActiviteFormValues
  >({
    resolver: zodResolver(createActiviteSchema),
    defaultValues: {
      titre: initialData?.titre ?? "",
      description: initialData?.description ?? "",
      date: initialData?.date ? initialData.date.slice(0, 10) : "",
      image: initialData?.image ?? "",
      statut: initialData?.statut ?? "BROUILLON",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        titre: initialData?.titre ?? "",
        description: initialData?.description ?? "",
        date: initialData?.date ? initialData.date.slice(0, 10) : "",
        image: initialData?.image ?? "",
        statut: initialData?.statut ?? "BROUILLON",
      });
    }
  }, [open, initialData, reset]);

  const submit = handleSubmit((values) => onSubmit(values));
  const statut = useWatch({ control, name: "statut" });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Modifier l'activité" : "Nouvelle activité"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Mettez à jour les informations de l'activité."
              : "Renseignez les informations de la nouvelle activité."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={submit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              {...register("titre")}
              aria-invalid={!!errors.titre}
            />
            {errors.titre ? (
              <p className="text-xs text-destructive">{errors.titre.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Image (URL)</Label>
            <Input
              id="image"
              type="text"
              placeholder="https://… ou /uploads/…"
              {...register("image")}
              aria-invalid={!!errors.image}
            />
            {errors.image ? (
              <p className="text-xs text-destructive">{errors.image.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="statut">Publication</Label>
            <Select
              value={statut}
              onValueChange={(value) =>
                value === "BROUILLON" || value === "PUBLIE"
                  ? setValue("statut", value)
                  : undefined
              }
            >
              <SelectTrigger id="statut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BROUILLON">Brouillon</SelectItem>
                <SelectItem value="PUBLIE">Publié</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description ? (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              aria-invalid={!!errors.date}
            />
            {errors.date ? (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            ) : null}
          </div>
        </form>

        <SheetFooter className="flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
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
