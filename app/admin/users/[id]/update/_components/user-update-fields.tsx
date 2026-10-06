"use client";

import type {
  Control,
  FieldErrors,
  FieldNamesMarkedBoolean,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { UserUpdateExtraFields } from "./user-update-extra-fields";
import { UserUpdateProfileFields } from "./user-update-profile-fields";
import type { FormValues } from "./user-update-schema";

export function UserUpdateFields({
  control,
  register,
  setValue,
  errors,
  dirtyFields,
  touchedFields,
  onPendingChange,
}: {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  dirtyFields: FieldNamesMarkedBoolean<FormValues>;
  touchedFields: FieldNamesMarkedBoolean<FormValues>;
  onPendingChange: (pending: boolean) => void;
}) {
  return (
    <>
      <UserUpdateProfileFields
        control={control}
        register={register}
        setValue={setValue}
        errors={errors}
        dirtyFields={dirtyFields}
        touchedFields={touchedFields}
      />
      <UserUpdateExtraFields
        control={control}
        setValue={setValue}
        errors={errors}
        onPendingChange={onPendingChange}
      />
    </>
  );
}
