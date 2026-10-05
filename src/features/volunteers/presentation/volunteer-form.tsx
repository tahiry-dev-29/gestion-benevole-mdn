"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { creatableRoles, isRole } from "@/lib/rbac";

import type { Volunteer } from "../volunteer.entity";

import { VolunteerFields } from "./_components/volunteer-fields";
import {
  buildVolunteerDefaults,
  type ManagedRole,
  toManagedRole,
  volunteerFormSchema,
  type VolunteerFormValues,
} from "./_components/volunteer-form-schema";
import { useCreateVolunteer, useUpdateVolunteer } from "./use-volunteers";

interface VolunteerFormProps {
  mode: "create" | "edit";
  initialData?: Volunteer | null;
  onSuccess?: () => void;
}

export function VolunteerForm({
  mode,
  initialData,
  onSuccess,
}: VolunteerFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionRole = session?.user?.role;
  const actorRole: Role | undefined = isRole(sessionRole)
    ? sessionRole
    : undefined;
  const allowed = React.useMemo<ManagedRole[]>(
    () => (actorRole ? creatableRoles(actorRole).map(toManagedRole) : []),
    [actorRole]
  );

  const isEdit = mode === "edit";
  const editingId = initialData?.id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: buildVolunteerDefaults(
      initialData,
      allowed[0] ?? "VOLUNTEER"
    ),
  });

  React.useEffect(() => {
    reset(buildVolunteerDefaults(initialData, allowed[0] ?? "VOLUNTEER"));
  }, [initialData, allowed, reset]);

  const createMutation = useCreateVolunteer();
  const updateMutation = useUpdateVolunteer();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const submit = handleSubmit((values) => {
    if (!isEdit) {
      if (!values.password || values.password.length < 8) {
        setError("password", {
          message: "Le mot de passe doit contenir au moins 8 caractères",
        });
        return;
      }
      if (!allowed.includes(values.role)) {
        setError("role", {
          message: "Vous n'êtes pas autorisé à créer ce rôle.",
        });
        return;
      }
      createMutation.mutate(
        {
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          password: values.password,
          role: values.role,
          dateEntree: values.dateEntree || undefined,
          statut: values.statut,
        },
        {
          onSuccess: () => {
            toast.success("Bénévole créé.");
            router.push("/admin/volunteer-management");
            router.refresh();
          },
          onError: (mutationError) => toast.error(mutationError.message),
        }
      );
      return;
    }

    if (editingId === undefined) return;
    updateMutation.mutate(
      {
        id: editingId,
        input: {
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          ...(values.password ? { password: values.password } : {}),
          role: values.role,
          statut: values.statut,
          dateEntree: values.dateEntree || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Bénévole mis à jour.");
          onSuccess?.();
          router.refresh();
        },
        onError: (mutationError) => toast.error(mutationError.message),
      }
    );
  });

  return (
    <form onSubmit={submit} className="grid max-w-2xl gap-6">
      <VolunteerFields
        register={register}
        control={control}
        errors={errors}
        isEdit={isEdit}
        allowed={allowed}
        actorRole={actorRole}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEdit ? "Enregistrer" : "Créer le compte"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.push("/admin/volunteer-management")}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
