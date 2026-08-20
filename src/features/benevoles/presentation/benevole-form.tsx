"use client";

import * as React from "react";
import { Controller,useForm } from "react-hook-form";
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

import type { Benevole } from "../domain/benevole.entity";

const formSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100),
  prenom: z.string().min(1, "Le prénom est requis").max(100),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 6, "Au moins 6 caractères"),
  role: z.enum(["ADMIN", "BENEVOLE"]),
  dateEntree: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface BenevoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Benevole | null;
  onSubmit: (values: FormValues) => void;
  isPending?: boolean;
}

export function BenevoleForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: BenevoleFormProps) {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: initialData?.nom ?? "",
      prenom: initialData?.prenom ?? "",
      email: initialData?.email ?? "",
      password: "",
      role: initialData?.role ?? "BENEVOLE",
      dateEntree: initialData?.dateEntree
        ? initialData.dateEntree.slice(0, 10)
        : "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        nom: initialData?.nom ?? "",
        prenom: initialData?.prenom ?? "",
        email: initialData?.email ?? "",
        password: "",
        role: initialData?.role ?? "BENEVOLE",
        dateEntree: initialData?.dateEntree
          ? initialData.dateEntree.slice(0, 10)
          : "",
      });
    }
  }, [open, initialData, reset]);

  const submit = handleSubmit((values) => {
    if (!isEdit && !values.password) {
      setError("password", { message: "Le mot de passe est requis pour un nouveau bénévole" });
      return;
    }
    onSubmit(values);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Modifier le bénévole" : "Nouveau bénévole"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Mettez à jour les informations du bénévole."
              : "Renseignez les informations du nouveau bénévole."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" {...register("nom")} aria-invalid={!!errors.nom} />
            {errors.nom ? (
              <p className="text-xs text-destructive">{errors.nom.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" {...register("prenom")} aria-invalid={!!errors.prenom} />
            {errors.prenom ? (
              <p className="text-xs text-destructive">{errors.prenom.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">
              Mot de passe{isEdit ? " (laisser vide pour ne pas changer)" : ""}
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Rôle</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Rôle">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BENEVOLE">Bénévole</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dateEntree">Date d&apos;entrée</Label>
            <Input id="dateEntree" type="date" {...register("dateEntree")} />
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
