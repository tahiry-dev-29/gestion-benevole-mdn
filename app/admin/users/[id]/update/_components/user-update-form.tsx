"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/features/user/components/use-users";

import { UserUpdateFields } from "./user-update-fields";
import { type FormValues, userUpdateFormSchema } from "./user-update-schema";

type UserData = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  sexe?: string | null;
  age?: number | null;
  categorie?: string | null;
  etablissement?: string | null;
  facebook?: string | null;
  matricule?: string | null;
  societe?: string | null;
  telephone?: string | null;
  dateNaissance?: Date | string | null;
  siteWeb?: string | null;
  cvUrl?: string | null;
  socialProfile?: string | null;
  joursDisponibles?: string[];
  contactUrgence?: string | null;
  spinneret?: string | null;
  accepteRegles?: boolean;
  materielPC?: boolean;
  certificatUrl?: string | null;
  statut?: string;
};

interface UserUpdateFormProps {
  userId: number;
  initialData: UserData;
}

function parseSexe(
  value: string | null | undefined
): NonNullable<FormValues["sexe"]> {
  const result = userUpdateFormSchema.shape.sexe.safeParse(value);
  return result.success ? (result.data ?? "Non précisé") : "Non précisé";
}

function parseCategorie(value: string | null | undefined) {
  const result = userUpdateFormSchema.shape.categorie.safeParse(value);
  return result.success ? result.data : undefined;
}

function parseStatut(value: string | null | undefined) {
  const result = userUpdateFormSchema.shape.statut.safeParse(value);
  return result.success ? result.data : "ACTIF";
}

export function UserUpdateForm({
  userId,
  initialData: d,
}: UserUpdateFormProps) {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const [pendingUploads, setPendingUploads] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver<FormValues, unknown, FormValues>(
      userUpdateFormSchema,
      undefined,
      { raw: true }
    ),
    defaultValues: {
      nom: d.nom,
      prenom: d.prenom,
      email: d.email,
      sexe: parseSexe(d.sexe),
      age: d.age ?? undefined,
      categorie: parseCategorie(d.categorie),
      etablissement: d.etablissement ?? "",
      facebook: d.facebook ?? "",
      matricule: d.matricule ?? "",
      societe: d.societe ?? "",
      telephone: d.telephone ?? "",
      dateNaissance: d.dateNaissance
        ? new Date(d.dateNaissance).toISOString().split("T")[0]
        : "",
      siteWeb: d.siteWeb ?? "",
      cvUrl: d.cvUrl ?? "",
      socialProfile: d.socialProfile ?? "",
      joursDisponibles: d.joursDisponibles ?? [],
      contactUrgence: d.contactUrgence ?? "",
      spinneret: d.spinneret ?? "",
      accepteRegles: d.accepteRegles ?? false,
      materielPC: d.materielPC ?? false,
      certificatUrl: d.certificatUrl ?? "",
      statut: parseStatut(d.statut),
    },
  });

  const markUploadPending = (pending: boolean) => {
    setPendingUploads((count) => Math.max(0, count + (pending ? 1 : -1)));
  };

  const onSubmit = (data: FormValues) => {
    updateUser.mutate(
      { id: userId, input: data },
      {
        onSuccess: () => {
          toast.success("Profil mis à jour avec succès.");
          router.push(`/admin/users/${userId}`);
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <UserUpdateFields
        control={control}
        register={register}
        setValue={setValue}
        errors={errors}
        onPendingChange={markUploadPending}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/users/${userId}`)}
          className="border-slate-700 text-slate-300"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={updateUser.isPending || pendingUploads > 0}
          className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
        >
          {(updateUser.isPending || pendingUploads > 0) && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
