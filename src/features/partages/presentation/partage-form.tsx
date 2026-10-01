"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis").max(150),
  contenu: z.string().trim().min(1, "Le contenu est requis").max(20000),
  statut: z.enum(["BROUILLON", "PUBLIE"]),
});

export type PartageFormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: (PartageFormValues & { id: number }) | null;
  onSubmit: (values: PartageFormValues) => void;
  isPending: boolean;
};

export function PartageForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<PartageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { titre: "", contenu: "", statut: "BROUILLON" },
  });
  const statut = useWatch({ control, name: "statut" });

  useEffect(() => {
    if (open)
      reset(initialData ?? { titre: "", contenu: "", statut: "BROUILLON" });
  }, [initialData, open, reset]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {initialData ? "Modifier le partage" : "Nouveau partage"}
          </SheetTitle>
          <SheetDescription>
            Préparez le contenu et choisissez son état de publication.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="partage-titre">Titre</Label>
            <Input
              id="partage-titre"
              {...register("titre")}
              aria-invalid={!!errors.titre}
            />
            {errors.titre ? (
              <p className="text-xs text-destructive">{errors.titre.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partage-contenu">Contenu</Label>
            <textarea
              id="partage-contenu"
              rows={8}
              {...register("contenu")}
              aria-invalid={!!errors.contenu}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.contenu ? (
              <p className="text-xs text-destructive">
                {errors.contenu.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="partage-statut">Publication</Label>
            <Select
              value={statut}
              onValueChange={(value) =>
                value === "BROUILLON" || value === "PUBLIE"
                  ? setValue("statut", value)
                  : undefined
              }
            >
              <SelectTrigger id="partage-statut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BROUILLON">Brouillon</SelectItem>
                <SelectItem value="PUBLIE">Publié</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {initialData ? "Enregistrer" : "Créer"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
