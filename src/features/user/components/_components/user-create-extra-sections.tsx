"use client";

import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateUserFormInput } from "@/features/user/user.schema";

import { PdfUploadField } from "./pdf-upload-field";
import { Field } from "./user-create-sections";

export function AdditionalSection({
  register,
  control,
}: {
  register: UseFormRegister<CreateUserFormInput>;
  control: Control<CreateUserFormInput>;
}) {
  return (
    <fieldset className="glass-sm rounded-lg p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">
        Informations complémentaires
      </legend>
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <Field htmlFor="create-socialProfile" label="Profil social">
          <Input
            type="url"
            placeholder="https://"
            className="min-h-11"
            id="create-socialProfile"
            {...register("socialProfile")}
          />
        </Field>
        <Field htmlFor="create-siteWeb" label="Site web">
          <Input
            type="url"
            placeholder="https://"
            className="min-h-11"
            id="create-siteWeb"
            {...register("siteWeb")}
          />
        </Field>
        <Field htmlFor="create-contactUrgence" label="Contact d’urgence">
          <Input
            className="min-h-11"
            id="create-contactUrgence"
            {...register("contactUrgence")}
          />
        </Field>
        <Field htmlFor="create-facebook" label="Facebook">
          <Input
            className="min-h-11"
            id="create-facebook"
            {...register("facebook")}
          />
        </Field>
        <div className="flex min-h-11 items-center gap-3">
          <Controller
            control={control}
            name="materielPC"
            render={({ field }) => (
              <Checkbox
                id="materielPC"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="materielPC">Dispose d’un ordinateur personnel</Label>
        </div>
        <div className="flex min-h-11 items-center gap-3">
          <Controller
            control={control}
            name="accepteRegles"
            render={({ field }) => (
              <Checkbox
                id="accepteRegles"
                required
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="accepteRegles">
            Confirme l’acceptation des règles *
          </Label>
        </div>
      </div>
    </fieldset>
  );
}

const AVAILABLE_DAYS = [
  ["MONDAY", "Lundi"],
  ["TUESDAY", "Mardi"],
  ["WEDNESDAY", "Mercredi"],
  ["THURSDAY", "Jeudi"],
  ["FRIDAY", "Vendredi"],
  ["SATURDAY", "Samedi"],
] as const;

export function AvailabilitySection({
  control,
}: {
  control: Control<CreateUserFormInput>;
}) {
  return (
    <fieldset className="glass-sm rounded-lg p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">Disponibilités</legend>
      <Controller
        control={control}
        name="joursDisponibles"
        render={({ field }) => (
          <div className="grid gap-2 pt-2 sm:grid-cols-3">
            {AVAILABLE_DAYS.map(([value, label]) => {
              const selected = field.value?.includes(value) ?? false;
              return (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3"
                >
                  <Checkbox
                    checked={selected}
                    onCheckedChange={(checked) => {
                      const current = field.value ?? [];
                      const next = checked
                        ? [...current, value]
                        : current.filter((day) => day !== value);
                      field.onChange(next);
                    }}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              );
            })}
          </div>
        )}
      />
    </fieldset>
  );
}

export function DocumentsSection({
  control,
  setValue,
  onPendingChange,
}: {
  control: Control<CreateUserFormInput>;
  setValue: UseFormSetValue<CreateUserFormInput>;
  onPendingChange: (pending: boolean) => void;
}) {
  return (
    <fieldset className="glass-sm rounded-lg p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">Documents</legend>
      <Controller
        control={control}
        name="cvUrl"
        render={({ field }) => (
          <div className="pt-2">
            <PdfUploadField
              id="create-cv"
              label="CV (facultatif)"
              type="cv"
              value={field.value ?? ""}
              onUploaded={(url) =>
                setValue("cvUrl", url, { shouldDirty: true })
              }
              onPendingChange={onPendingChange}
            />
          </div>
        )}
      />
    </fieldset>
  );
}
