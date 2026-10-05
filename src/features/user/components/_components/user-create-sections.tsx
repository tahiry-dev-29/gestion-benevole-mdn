"use client";

import { useEffect } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateUserFormInput } from "@/features/user/user.schema";

/**
 * Calcule l'âge à partir d'une date de naissance `YYYY-MM-DD`.
 *
 * La date est lue champ par champ : `new Date("2000-05-15")` est interprété
 * comme UTC minuit alors que `getFullYear()`/`getDate()` travaillent en heure
 * locale, ce qui décale la naissance d'un jour selon le fuseau et fausse le
 * calcul autour de l'anniversaire.
 */
function computeAge(dateStr: string | undefined): number | "" {
  if (!dateStr) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";

  const now = new Date();
  let age = now.getFullYear() - year;
  // Mois 0-based côté Date : on compare donc month-1 au mois courant.
  const hasHadBirthdayThisYear =
    now.getMonth() + 1 > month ||
    (now.getMonth() + 1 === month && now.getDate() >= day);
  if (!hasHadBirthdayThisYear) age--;

  return age >= 0 ? age : "";
}

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function IdentitySection({
  register,
  errors,
  control,
  setValue,
}: {
  register: UseFormRegister<CreateUserFormInput>;
  errors: FieldErrors<CreateUserFormInput>;
  control: Control<CreateUserFormInput>;
  setValue: UseFormSetValue<CreateUserFormInput>;
}) {
  const dateNaissance = useWatch({ control, name: "dateNaissance" });
  const computedAge = computeAge(dateNaissance);

  useEffect(() => {
    setValue("age", computedAge === "" ? undefined : computedAge);
  }, [computedAge, setValue]);

  return (
    <fieldset className="glass-sm rounded-lg p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">
        Identité et contact
      </legend>
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <Field
          htmlFor="create-prenom"
          label="Prénom *"
          error={errors.prenom?.message}
        >
          <Input
            autoComplete="given-name"
            className="min-h-11"
            id="create-prenom"
            {...register("prenom")}
          />
        </Field>
        <Field htmlFor="create-nom" label="Nom *" error={errors.nom?.message}>
          <Input
            autoComplete="family-name"
            className="min-h-11"
            id="create-nom"
            {...register("nom")}
          />
        </Field>
        <Field
          htmlFor="create-email"
          label="Email *"
          error={errors.email?.message}
        >
          <Input
            type="email"
            autoComplete="email"
            className="min-h-11"
            id="create-email"
            {...register("email")}
          />
        </Field>
        <Field
          htmlFor="create-telephone"
          label="Téléphone / WhatsApp *"
          error={errors.telephone?.message}
        >
          <Input
            type="tel"
            autoComplete="tel"
            className="min-h-11"
            id="create-telephone"
            {...register("telephone")}
          />
        </Field>
        <Field
          htmlFor="create-matricule"
          label="Matricule *"
          error={errors.matricule?.message}
        >
          <Input
            className="min-h-11"
            id="create-matricule"
            {...register("matricule")}
          />
        </Field>
        <Field htmlFor="create-sexe" label="Genre">
          <Controller
            control={control}
            name="sexe"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="create-sexe" className="min-h-11">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculin">Masculin</SelectItem>
                  <SelectItem value="Féminin">Féminin</SelectItem>
                  <SelectItem value="Non précisé">Non précisé</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field htmlFor="create-dateNaissance" label="Date de naissance">
          <Input
            type="date"
            className="min-h-11"
            id="create-dateNaissance"
            {...register("dateNaissance")}
          />
        </Field>
        <Field htmlFor="create-age" label="Âge (calculé automatiquement)">
          <Input
            type="number"
            className="min-h-11 cursor-not-allowed bg-muted text-muted-foreground"
            id="create-age"
            value={computedAge}
            readOnly
            tabIndex={-1}
            placeholder="—"
          />
        </Field>
      </div>
    </fieldset>
  );
}

export function OrganizationSection({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<CreateUserFormInput>;
  errors: FieldErrors<CreateUserFormInput>;
  control: Control<CreateUserFormInput>;
}) {
  return (
    <fieldset className="glass-sm rounded-lg p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">
        Études et activité
      </legend>
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <Field
          htmlFor="create-etablissement"
          label="École / établissement"
          error={errors.etablissement?.message}
        >
          <Input
            className="min-h-11"
            id="create-etablissement"
            {...register("etablissement")}
          />
        </Field>
        <Field
          htmlFor="create-societe"
          label="Société"
          error={errors.societe?.message}
        >
          <Input
            className="min-h-11"
            id="create-societe"
            {...register("societe")}
          />
        </Field>
        <Field htmlFor="create-categorie" label="Catégorie">
          <Controller
            control={control}
            name="categorie"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="create-categorie" className="min-h-11">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                  <SelectItem value="COLLEGIEN">Collégien</SelectItem>
                  <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                  <SelectItem value="SALARIE">Salarié</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field
          htmlFor="create-spinneret"
          label="Spinneret"
          error={errors.spinneret?.message}
        >
          <Input
            className="min-h-11"
            id="create-spinneret"
            {...register("spinneret")}
          />
        </Field>
      </div>
    </fieldset>
  );
}
