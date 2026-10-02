"use client";

import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { PdfUploadField } from "@/features/user/components/_components/pdf-upload-field";

import { Section } from "./user-update-field-primitives";
import type { FormValues } from "./user-update-schema";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;
const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
};

export function UserUpdateExtraFields({
  control,
  setValue,
  errors,
  onPendingChange,
}: {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  onPendingChange: (pending: boolean) => void;
}) {
  const days = useWatch({ control, name: "joursDisponibles" }) ?? [];
  const personalComputer = useWatch({ control, name: "materielPC" });
  const acceptedRules = useWatch({ control, name: "accepteRegles" });
  const cvUrl = useWatch({ control, name: "cvUrl" });
  const certificateUrl = useWatch({ control, name: "certificatUrl" });

  function toggleDay(day: string) {
    const next = days.includes(day)
      ? days.filter((current) => current !== day)
      : [...days, day];
    setValue("joursDisponibles", next, { shouldDirty: true });
  }

  return (
    <>
      <Section title="Disponibilités">
        <div className="flex flex-wrap gap-3">
          {DAYS.map((day) => (
            <label
              key={day}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
            >
              <Checkbox
                checked={days.includes(day)}
                onCheckedChange={() => toggleDay(day)}
              />
              {DAY_LABELS[day]}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Pièces jointes">
        <PdfUploadField
          id="user-cv"
          label="CV"
          type="cv"
          value={cvUrl ?? ""}
          onUploaded={(url) => setValue("cvUrl", url, { shouldDirty: true })}
          onPendingChange={onPendingChange}
        />
        {errors.cvUrl?.message ? (
          <p className="text-xs text-destructive">{errors.cvUrl.message}</p>
        ) : null}
        <PdfUploadField
          id="user-certificate"
          label="Certificat"
          type="certificat"
          value={certificateUrl ?? ""}
          onUploaded={(url) =>
            setValue("certificatUrl", url, { shouldDirty: true })
          }
          onPendingChange={onPendingChange}
        />
        {errors.certificatUrl?.message ? (
          <p className="text-xs text-destructive">
            {errors.certificatUrl.message}
          </p>
        ) : null}
      </Section>

      <Section title="Règles et équipement">
        <div className="space-y-3">
          <CheckboxField
            checked={personalComputer}
            label="Dispose d’un PC personnel"
            onChange={(checked) => setValue("materielPC", checked)}
          />
          <CheckboxField
            checked={acceptedRules}
            label="A accepté les règles de l’association"
            onChange={(checked) => setValue("accepteRegles", checked)}
          />
        </div>
      </Section>
    </>
  );
}

function CheckboxField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}
