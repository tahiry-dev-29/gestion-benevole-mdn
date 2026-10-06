"use client";

import { useEffect } from "react";
import type {
  Control,
  FieldErrors,
  FieldNamesMarkedBoolean,
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

const fieldStateClass = (dirty?: boolean, invalid?: boolean) =>
  invalid
    ? "border-destructive bg-destructive/5 ring-2 ring-destructive/20"
    : dirty
      ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
      : "";

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
  const today = new Date(
    now.toLocaleDateString("en-CA", { timeZone: "Indian/Antananarivo" })
  );
  let age = today.getUTCFullYear() - year;
  const hasHadBirthdayThisYear =
    today.getUTCMonth() + 1 > month ||
    (today.getUTCMonth() + 1 === month && today.getUTCDate() >= day);
  if (!hasHadBirthdayThisYear) age--;

  return age >= 0 ? age : "";
}

export function Field({
  label,
  htmlFor,
  error,
  dirty,
  touched,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  dirty?: boolean;
  touched?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2" data-invalid={!!error}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      <div
        className={
          error
            ? "[&_input]:!border-destructive [&_input]:!bg-destructive/10 [&_input]:!ring-2 [&_input]:!ring-destructive/30 [&_button[data-slot=select-trigger]]:!border-destructive [&_button[data-slot=select-trigger]]:!bg-destructive/10 [&_[data-slot=checkbox]]:!border-destructive [&_[data-slot=checkbox]]:!bg-destructive/10"
            : dirty || touched
              ? "[&_input]:!border-primary/70 [&_input]:!bg-primary/10 [&_input]:!ring-2 [&_input]:!ring-primary/20 [&_button[data-slot=select-trigger]]:!border-primary/70 [&_button[data-slot=select-trigger]]:!bg-primary/10 [&_[data-slot=checkbox]]:!border-primary/70"
              : ""
        }
      >
        {children}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function IdentitySection({
  register,
  errors,
  control,
  setValue,
  dirtyFields,
  touchedFields,
}: {
  register: UseFormRegister<CreateUserFormInput>;
  errors: FieldErrors<CreateUserFormInput>;
  control: Control<CreateUserFormInput>;
  setValue: UseFormSetValue<CreateUserFormInput>;
  dirtyFields: FieldNamesMarkedBoolean<CreateUserFormInput>;
  touchedFields: FieldNamesMarkedBoolean<CreateUserFormInput>;
}) {
  const dateNaissance = useWatch({ control, name: "dateNaissance" });
  const computedAge = computeAge(dateNaissance);

  useEffect(() => {
    setValue("age", computedAge === "" ? undefined : computedAge, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
          dirty={dirtyFields.prenom}
          touched={touchedFields.prenom}
        >
          <Input
            autoComplete="given-name"
            className={`min-h-11 ${fieldStateClass(dirtyFields.prenom || touchedFields.prenom, !!errors.prenom)}`}
            id="create-prenom"
            aria-invalid={!!errors.prenom}
            {...register("prenom")}
          />
        </Field>
        <Field
          htmlFor="create-nom"
          label="Nom *"
          error={errors.nom?.message}
          dirty={dirtyFields.nom}
          touched={touchedFields.nom}
        >
          <Input
            autoComplete="family-name"
            className={`min-h-11 ${fieldStateClass(dirtyFields.nom || touchedFields.nom, !!errors.nom)}`}
            id="create-nom"
            aria-invalid={!!errors.nom}
            {...register("nom")}
          />
        </Field>
        <Field
          htmlFor="create-email"
          label="Email *"
          error={errors.email?.message}
          dirty={dirtyFields.email}
          touched={touchedFields.email}
        >
          <Input
            type="email"
            autoComplete="email"
            className={`min-h-11 ${fieldStateClass(dirtyFields.email || touchedFields.email, !!errors.email)}`}
            id="create-email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field
          htmlFor="create-telephone"
          label="Téléphone / WhatsApp *"
          error={errors.telephone?.message}
          dirty={dirtyFields.telephone}
          touched={touchedFields.telephone}
        >
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="+261 34 12 345 67"
            className={`min-h-11 ${fieldStateClass(dirtyFields.telephone || touchedFields.telephone, !!errors.telephone)}`}
            id="create-telephone"
            aria-invalid={!!errors.telephone}
            {...register("telephone")}
          />
        </Field>
        <Field
          htmlFor="create-matricule"
          label="Matricule *"
          error={errors.matricule?.message}
          dirty={dirtyFields.matricule}
          touched={touchedFields.matricule}
        >
          <Input
            className={`min-h-11 ${fieldStateClass(dirtyFields.matricule || touchedFields.matricule, !!errors.matricule)}`}
            id="create-matricule"
            aria-invalid={!!errors.matricule}
            {...register("matricule")}
          />
        </Field>
        <Field
          htmlFor="create-sexe"
          label="Genre"
          dirty={dirtyFields.sexe}
          touched={touchedFields.sexe}
        >
          <Controller
            control={control}
            name="sexe"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="create-sexe"
                  aria-invalid={!!errors.sexe}
                  className="min-h-11"
                >
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
        <Field
          htmlFor="create-dateNaissance"
          label="Date de naissance"
          dirty={dirtyFields.dateNaissance}
          touched={touchedFields.dateNaissance}
        >
          <Input
            type="date"
            className="min-h-11"
            id="create-dateNaissance"
            aria-invalid={!!errors.dateNaissance}
            {...register("dateNaissance")}
          />
        </Field>
        <Field
          htmlFor="create-age"
          label="Âge (calculé automatiquement)"
          dirty={dirtyFields.age}
          touched={touchedFields.age}
        >
          <Input
            type="number"
            className="min-h-11 cursor-not-allowed bg-muted text-muted-foreground"
            id="create-age"
            aria-invalid={!!errors.age}
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
  const category = useWatch({ control, name: "categorie" });
  return (
    <fieldset className="glass-sm rounded-lg p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">
        Études et activité
      </legend>
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <Field
          htmlFor="create-categorie"
          label="Catégorie"
          error={errors.categorie?.message}
          dirty={Boolean(category)}
          touched={Boolean(category)}
        >
          <Controller
            control={control}
            name="categorie"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="create-categorie"
                  aria-invalid={!!errors.categorie}
                  className="min-h-11"
                >
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
        {category === "SALARIE" ? (
          <Field
            htmlFor="create-societe"
            label="Société"
            error={errors.societe?.message}
            dirty={!!category}
            touched={!!category}
          >
            <Input
              className="min-h-11"
              id="create-societe"
              {...register("societe")}
            />
          </Field>
        ) : category ? (
          <Field
            htmlFor="create-etablissement"
            label="École / établissement"
            error={errors.etablissement?.message}
            dirty={!!category}
            touched={!!category}
          >
            <Input
              className="min-h-11"
              id="create-etablissement"
              {...register("etablissement")}
            />
          </Field>
        ) : null}
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
