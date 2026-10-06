"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateUser } from "@/features/user/components/use-users";
import {
  type CreateUserFormInput,
  type CreateUserInput,
  createUserSchema,
} from "@/features/user/user.schema";

import {
  AdditionalSection,
  AvailabilitySection,
  DocumentsSection,
} from "./_components/user-create-extra-sections";
import {
  IdentitySection,
  OrganizationSection,
} from "./_components/user-create-sections";

export function CreateUserForm() {
  const router = useRouter();
  const createUser = useCreateUser();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<CreateUserFormInput, unknown, CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      matricule: "",
      telephone: "",
      materielPC: false,
      accepteRegles: false,
      sexe: "Non précisé",
      etablissement: "",
      societe: "",
      socialProfile: "",
      siteWeb: "",
      contactUrgence: "",
      facebook: "",
      joursDisponibles: [],
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    setSubmitError("");
    createUser.mutate(data, {
      onSuccess: () => {
        toast.success("Compte USER créé.");
        router.push("/admin/users");
      },
      onError: (error) => {
        setSubmitError(error.message);
        toast.error(error.message);
      },
    });
  };
  const [pendingUploads, setPendingUploads] = useState(0);
  const markUploadPending = (pending: boolean) => {
    setPendingUploads((count) => Math.max(0, count + (pending ? 1 : -1)));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <IdentitySection
        register={register}
        errors={errors}
        control={control}
        setValue={setValue}
        dirtyFields={dirtyFields}
        touchedFields={touchedFields}
      />
      <OrganizationSection
        register={register}
        errors={errors}
        control={control}
      />
      <AdditionalSection
        register={register}
        control={control}
        dirtyFields={dirtyFields}
        touchedFields={touchedFields}
      />
      <AvailabilitySection control={control} />
      <DocumentsSection
        control={control}
        setValue={setValue}
        onPendingChange={markUploadPending}
      />
      <p className="sr-only" aria-live="polite">
        {Object.keys(touchedFields).length} champs visités,{" "}
        {Object.keys(dirtyFields).length} champs modifiés.
      </p>

      {errors.root?.message || submitError ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {submitError || errors.root?.message}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:justify-end">
        <Button asChild type="button" variant="outline" className="min-h-11">
          <Link href="/admin/users">
            <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Annuler
          </Link>
        </Button>
        <Button
          type="submit"
          disabled={createUser.isPending || pendingUploads > 0}
          className="min-h-11 gap-2"
        >
          {createUser.isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : null}
          Créer le compte USER
        </Button>
      </div>
    </form>
  );
}
