"use client";

import { useEffect } from "react";
import type {
  Control,
  FieldErrors,
  FieldNamesMarkedBoolean,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField, Section } from "./user-update-field-primitives";
import { type FormValues, userUpdateFormSchema } from "./user-update-schema";

const fieldClass = "min-h-11 bg-background";

function computeAge(dateStr: string | undefined): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr ?? "");
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const now = new Date();
  const today = new Date(
    now.toLocaleDateString("en-CA", { timeZone: "Indian/Antananarivo" })
  );
  let age = today.getUTCFullYear() - year;
  if (
    today.getUTCMonth() + 1 < month ||
    (today.getUTCMonth() + 1 === month && today.getUTCDate() < day)
  )
    age--;
  return age >= 0 ? age : undefined;
}

export function UserUpdateProfileFields({
  control,
  register,
  setValue,
  errors,
  dirtyFields,
  touchedFields,
}: {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  dirtyFields: FieldNamesMarkedBoolean<FormValues>;
  touchedFields: FieldNamesMarkedBoolean<FormValues>;
}) {
  const sex = useWatch({ control, name: "sexe" });
  const category = useWatch({ control, name: "categorie" });
  const birthDate = useWatch({ control, name: "dateNaissance" });
  const age = computeAge(birthDate);
  useEffect(() => {
    setValue("age", age, { shouldDirty: true, shouldValidate: true });
  }, [age, setValue]);

  return (
    <>
      <Section title="Identité">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Prénom *"
            error={errors.prenom?.message}
            dirty={dirtyFields.prenom}
            touched={touchedFields.prenom}
          >
            <Input
              {...register("prenom")}
              aria-invalid={!!errors.prenom}
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Nom *"
            error={errors.nom?.message}
            dirty={dirtyFields.nom}
            touched={touchedFields.nom}
          >
            <Input
              {...register("nom")}
              aria-invalid={!!errors.nom}
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Email *"
            error={errors.email?.message}
            dirty={dirtyFields.email}
            touched={touchedFields.email}
          >
            <Input
              {...register("email")}
              aria-invalid={!!errors.email}
              type="email"
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Genre"
            dirty={dirtyFields.sexe}
            touched={touchedFields.sexe}
          >
            <Select
              value={sex}
              onValueChange={(value) => {
                const parsed = userUpdateFormSchema.shape.sexe.safeParse(value);
                if (parsed.success) setValue("sexe", parsed.data);
              }}
            >
              <SelectTrigger
                aria-invalid={!!errors.sexe}
                className={`${fieldClass} h-9`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculin">Masculin</SelectItem>
                <SelectItem value="Féminin">Féminin</SelectItem>
                <SelectItem value="Non précisé">Non précisé</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label="Matricule *"
            error={errors.matricule?.message}
            dirty={dirtyFields.matricule}
            touched={touchedFields.matricule}
          >
            <Input
              {...register("matricule")}
              aria-invalid={!!errors.matricule}
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Téléphone *"
            error={errors.telephone?.message}
            dirty={dirtyFields.telephone}
            touched={touchedFields.telephone}
          >
            <Input
              {...register("telephone")}
              aria-invalid={!!errors.telephone}
              type="tel"
              placeholder="+261 34 12 345 67"
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Date de naissance"
            dirty={dirtyFields.dateNaissance}
            touched={touchedFields.dateNaissance}
          >
            <Input
              {...register("dateNaissance")}
              aria-invalid={!!errors.dateNaissance}
              type="date"
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Âge"
            error={errors.age?.message}
            dirty={dirtyFields.age}
            touched={touchedFields.age}
          >
            <Input
              value={age ?? ""}
              aria-invalid={!!errors.age}
              type="number"
              min={1}
              max={120}
              readOnly
              tabIndex={-1}
              aria-label="Âge calculé automatiquement"
              className={fieldClass}
            />
          </FormField>
        </div>
      </Section>

      <Section title="Scolarité et société">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {category === "SALARIE" ? (
            <FormField
              label="Société"
              error={errors.societe?.message}
              dirty={dirtyFields.societe}
              touched={touchedFields.societe}
            >
              <Input
                {...register("societe")}
                aria-invalid={!!errors.societe}
                className={fieldClass}
              />
            </FormField>
          ) : category ? (
            <FormField
              label="École"
              error={errors.etablissement?.message}
              dirty={dirtyFields.etablissement}
              touched={touchedFields.etablissement}
            >
              <Input
                {...register("etablissement")}
                aria-invalid={!!errors.etablissement}
                className={fieldClass}
              />
            </FormField>
          ) : null}
          <FormField
            label="Catégorie"
            dirty={dirtyFields.categorie}
            touched={touchedFields.categorie}
          >
            <Select
              value={category ?? ""}
              onValueChange={(value) => {
                const parsed =
                  userUpdateFormSchema.shape.categorie.safeParse(value);
                if (parsed.success) {
                  setValue("categorie", parsed.data, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue("societe", "", { shouldDirty: true });
                  setValue("etablissement", "", { shouldDirty: true });
                }
              }}
            >
              <SelectTrigger
                aria-invalid={!!errors.categorie}
                className={`${fieldClass} h-9`}
              >
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                <SelectItem value="COLLEGIEN">Collégien</SelectItem>
                <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                <SelectItem value="SALARIE">Salarié</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            label="Spinneret"
            dirty={dirtyFields.spinneret}
            touched={touchedFields.spinneret}
          >
            <Input
              {...register("spinneret")}
              aria-invalid={!!errors.spinneret}
              className={fieldClass}
            />
          </FormField>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Profil social (URL)"
            dirty={dirtyFields.socialProfile}
            touched={touchedFields.socialProfile}
          >
            <Input
              {...register("socialProfile")}
              type="url"
              className={fieldClass}
            />
          </FormField>
          <FormField
            label="Site web (URL)"
            dirty={dirtyFields.siteWeb}
            touched={touchedFields.siteWeb}
          >
            <Input {...register("siteWeb")} type="url" className={fieldClass} />
          </FormField>
          <FormField
            label="Contact d’urgence"
            dirty={dirtyFields.contactUrgence}
            touched={touchedFields.contactUrgence}
          >
            <Input {...register("contactUrgence")} className={fieldClass} />
          </FormField>
          <FormField
            label="Facebook"
            dirty={dirtyFields.facebook}
            touched={touchedFields.facebook}
          >
            <Input {...register("facebook")} className={fieldClass} />
          </FormField>
        </div>
      </Section>
    </>
  );
}
