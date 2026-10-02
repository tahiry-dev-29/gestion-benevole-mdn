"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/features/user/user.action";
import {
  CategoryEnum,
  SexeEnum,
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/features/user/user.schema";

import {
  ProfileFields,
  type ProfileFormData,
} from "./_components/profile-fields";
import { ProfilePhotoField } from "./_components/profile-photo-field";

interface ProfileFormProps {
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    photo?: string | null;
    sexe?: string | null;
    age?: number | null;
    contact?: string | null;
    categorie?: string | null;
    etablissement?: string | null;
    facebook?: string | null;
  };
}

const uploadResponseSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), url: z.string().min(1) }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

function initialSexe(value: string | null | undefined) {
  const parsed = SexeEnum.safeParse(value);
  return parsed.success ? parsed.data : "Non précisé";
}

function initialCategory(value: string | null | undefined) {
  const parsed = CategoryEnum.safeParse(value);
  return parsed.success ? parsed.data : "UNIVERSITAIRE";
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProfileFormData>({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    photo: user.photo || "",
    sexe: initialSexe(user.sexe),
    age: user.age ?? "",
    contact: user.contact || "",
    categorie: initialCategory(user.categorie),
    etablissement: user.etablissement || "",
    facebook: user.facebook || "",
  });

  const imageUpload = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.set("file", file);
      data.set("type", "image");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const parsed = uploadResponseSchema.safeParse(await response.json());
      if (!parsed.success) throw new Error("Réponse d’upload invalide.");
      if (!response.ok || !parsed.data.success) {
        throw new Error(
          parsed.data.success
            ? "Impossible d’envoyer l’image."
            : parsed.data.error
        );
      }
      return parsed.data.url;
    },
    onSuccess: (photo) => {
      setFormData((previous) => ({ ...previous, photo }));
      toast.success("Photo envoyée.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Erreur d’upload de l’image."
      ),
  });

  const profileUpdate = useMutation({
    mutationFn: (payload: UpdateProfileInput) =>
      updateProfileAction(user.id, payload),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Une erreur est survenue.");
        return;
      }
      toast.success("Profil mis à jour avec succès !");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
    },
    onError: () => toast.error("Une erreur est survenue."),
  });

  const handleFieldChange = (
    field: keyof ProfileFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) imageUpload.mutate(file);
    e.currentTarget.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = updateProfileSchema.safeParse({
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      photo: formData.photo || null,
      sexe: formData.sexe || undefined,
      age: formData.age !== "" ? Number(formData.age) : undefined,
      contact: formData.contact || undefined,
      categorie: formData.categorie || undefined,
      etablissement: formData.etablissement || undefined,
      facebook: formData.facebook || undefined,
    });
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Vérifiez les champs du profil."
      );
      return;
    }
    profileUpdate.mutate(parsed.data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative bg-card p-6 rounded-xl border shadow-sm space-y-6"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/dashboard")}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          title="Fermer"
        >
          <X className="size-5" />
        </Button>

        <ProfilePhotoField
          photo={formData.photo}
          nom={formData.nom}
          prenom={formData.prenom}
          uploading={imageUpload.isPending}
          onFileChange={handleImageUpload}
          onRemovePhoto={() => setFormData((p) => ({ ...p, photo: "" }))}
        />

        <ProfileFields formData={formData} onChange={handleFieldChange} />

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
            disabled={profileUpdate.isPending || imageUpload.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={profileUpdate.isPending || imageUpload.isPending}
          >
            {profileUpdate.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
