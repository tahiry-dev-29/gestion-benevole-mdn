"use client";

import type {
  Control,
  FieldErrors,
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

const fieldClass = "bg-slate-950/60 border-slate-800 text-slate-200 text-sm";

export function UserUpdateProfileFields({
  control,
  register,
  setValue,
  errors,
}: {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const sex = useWatch({ control, name: "sexe" });
  const category = useWatch({ control, name: "categorie" });

  return (
    <>
      <Section title="Identité">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Prénom *" error={errors.prenom?.message}>
            <Input {...register("prenom")} className={fieldClass} />
          </FormField>
          <FormField label="Nom *" error={errors.nom?.message}>
            <Input {...register("nom")} className={fieldClass} />
          </FormField>
          <FormField label="Email *" error={errors.email?.message}>
            <Input {...register("email")} type="email" className={fieldClass} />
          </FormField>
          <FormField label="Genre">
            <Select
              value={sex}
              onValueChange={(value) => {
                const parsed = userUpdateFormSchema.shape.sexe.safeParse(value);
                if (parsed.success) setValue("sexe", parsed.data);
              }}
            >
              <SelectTrigger className={`${fieldClass} h-9`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculin">Masculin</SelectItem>
                <SelectItem value="Féminin">Féminin</SelectItem>
                <SelectItem value="Non précisé">Non précisé</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Matricule *" error={errors.matricule?.message}>
            <Input {...register("matricule")} className={fieldClass} />
          </FormField>
          <FormField label="Téléphone *" error={errors.telephone?.message}>
            <Input {...register("telephone")} className={fieldClass} />
          </FormField>
          <FormField label="Date de naissance">
            <Input
              {...register("dateNaissance")}
              type="date"
              className={fieldClass}
            />
          </FormField>
          <FormField label="Âge" error={errors.age?.message}>
            <Input
              {...register("age", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
              })}
              type="number"
              min={1}
              max={120}
              className={fieldClass}
            />
          </FormField>
        </div>
      </Section>

      <Section title="Scolarité et société">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="École">
            <Input {...register("etablissement")} className={fieldClass} />
          </FormField>
          <FormField label="Société">
            <Input {...register("societe")} className={fieldClass} />
          </FormField>
          <FormField label="Catégorie">
            <Select
              value={category ?? ""}
              onValueChange={(value) => {
                const parsed =
                  userUpdateFormSchema.shape.categorie.safeParse(value);
                if (parsed.success) setValue("categorie", parsed.data);
              }}
            >
              <SelectTrigger className={`${fieldClass} h-9`}>
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
          <FormField label="Spinneret">
            <Input {...register("spinneret")} className={fieldClass} />
          </FormField>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Profil social (URL)">
            <Input
              {...register("socialProfile")}
              type="url"
              className={fieldClass}
            />
          </FormField>
          <FormField label="Site web (URL)">
            <Input {...register("siteWeb")} type="url" className={fieldClass} />
          </FormField>
          <FormField label="Contact d’urgence">
            <Input {...register("contactUrgence")} className={fieldClass} />
          </FormField>
          <FormField label="Facebook">
            <Input {...register("facebook")} className={fieldClass} />
          </FormField>
        </div>
      </Section>
    </>
  );
}
