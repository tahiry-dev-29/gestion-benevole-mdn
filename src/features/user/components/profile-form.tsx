"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/features/user/user.action";
import type { Category, Sexe } from "@/features/user/user.schema";

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

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    nom: user.nom || "",
    prenom: user.prenom || "",
    email: user.email || "",
    photo: user.photo || "",
    sexe: user.sexe || "Masculin",
    age: user.age ?? "",
    contact: user.contact || "",
    categorie: user.categorie || "UNIVERSITAIRE",
    etablissement: user.etablissement || "",
    facebook: user.facebook || "",
  });

  const handleFieldChange = (
    field: keyof ProfileFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur upload");
      setFormData((prev) => ({ ...prev, photo: json.url }));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur d'upload de l'image"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        photo: formData.photo || null,
        sexe: (formData.sexe as Sexe) || undefined,
        age: formData.age !== "" ? Number(formData.age) : undefined,
        contact: formData.contact || undefined,
        categorie: (formData.categorie as Category) || undefined,
        etablissement: formData.etablissement || undefined,
        facebook: formData.facebook || undefined,
      };

      const res = await updateProfileAction(user.id, payload);
      if (res.success) {
        setSuccess("Profil mis à jour avec succès !");
        router.refresh();
      } else {
        setError(res.error || "Une erreur est survenue.");
      }
    });
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
          onClick={() => router.push("/admin/users")}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          title="Fermer"
        >
          <X className="size-5" />
        </Button>

        {error && (
          <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm bg-emerald-500/15 text-emerald-600 rounded-md">
            {success}
          </div>
        )}

        <ProfilePhotoField
          photo={formData.photo}
          nom={formData.nom}
          prenom={formData.prenom}
          uploading={uploading}
          onFileChange={handleImageUpload}
          onRemovePhoto={() => setFormData((p) => ({ ...p, photo: "" }))}
        />

        <ProfileFields formData={formData} onChange={handleFieldChange} />

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/users")}
            disabled={isPending || uploading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending || uploading}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
