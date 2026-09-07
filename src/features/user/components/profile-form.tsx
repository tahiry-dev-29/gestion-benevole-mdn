"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/features/user/user.action";
import type { Category, Sexe } from "@/features/user/user.schema";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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

      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Erreur lors de l'upload.");
      } else {
        setFormData((prev) => ({ ...prev, photo: result.url }));
      }
    } catch {
      setError("Erreur réseau lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await updateProfileAction(user.id, {
        ...formData,
        age: formData.age !== "" ? Number(formData.age) : undefined,
        categorie: formData.categorie as Category | undefined,
        sexe: formData.sexe as Sexe,
      });
      if (!res.success) {
        setError(res.error || "Erreur lors de la mise à jour.");
      } else {
        setSuccess("Profil mis à jour avec succès !");
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative bg-card p-6 rounded-xl border shadow-sm space-y-6">
        {/* Bouton de fermeture au coin haut droit de la carte */}
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

        {error && <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">{error}</div>}
        {success && <div className="p-3 text-sm bg-emerald-500/15 text-emerald-600 rounded-md">{success}</div>}

        {/* Section Photo */}
        <div className="flex flex-col items-center gap-3 border-b pb-6">
          <div className="relative size-28 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            {formData.photo ? (
              <img src={formData.photo} alt="Photo de profil" className="size-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {formData.prenom[0]?.toUpperCase()}{formData.nom[0]?.toUpperCase()}
              </span>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
          </div>

          <Label htmlFor="photo-upload" className="cursor-pointer">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Camera className="size-4" /> Changer la photo
            </span>
            <Input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading || isPending}
            />
          </Label>
        </div>

        {/* Grille de champs (2 colonnes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact">Contact / Téléphone</Label>
            <Input
              id="contact"
              placeholder="Ex: +261 34 00 000 00"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sexe">Sexe</Label>
            <select
              id="sexe"
              value={formData.sexe}
              onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Non précisé">Non précisé</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categorie">Catégorie</Label>
            <select
              id="categorie"
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="PRIMAIRE">Primaire</option>
              <option value="COLLEGIEN">Collégien</option>
              <option value="UNIVERSITAIRE">Universitaire</option>
              <option value="SALARIE">Salarié</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="etablissement">Établissement</Label>
            <Input
              id="etablissement"
              placeholder="Ex: IS2M, Université..."
              value={formData.etablissement}
              onChange={(e) => setFormData({ ...formData, etablissement: e.target.value })}
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="facebook">Profil Facebook</Label>
            <Input
              id="facebook"
              placeholder="Ex: https://facebook.com/nom ou Nom complet"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
          </div>
        </div>

        {/* Boutons d'action */}
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