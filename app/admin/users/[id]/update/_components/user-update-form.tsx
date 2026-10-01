"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserAction } from "@/features/user/user.action";

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

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  sexe: z.enum(["Masculin", "Féminin", "Non précisé"]).optional(),
  matricule: z.string().min(1, "Le matricule est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  materielPC: z.boolean(),
  accepteRegles: z.boolean(),
  spinneret: z.string().optional(),
  etablissement: z.string().optional(),
  societe: z.string().optional(),
  age: z.coerce.number().int().min(1).max(120).optional(),
  dateNaissance: z.string().optional(),
  socialProfile: z.string().optional(),
  cvUrl: z.string().optional(),
  certificatUrl: z.string().optional(),
  siteWeb: z.string().optional(),
  joursDisponibles: z.array(z.string()).optional(),
  contactUrgence: z.string().optional(),
  facebook: z.string().optional(),
  categorie: z
    .enum(["PRIMAIRE", "COLLEGIEN", "UNIVERSITAIRE", "SALARIE"])
    .optional(),
  statut: z.enum(["ACTIF", "INACTIF"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserUpdateFormProps {
  userId: number;
  initialData: UserData;
}

const JOURS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const JOURS_FR: Record<string, string> = {
  MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi",
};

export function UserUpdateForm({ userId, initialData: d }: UserUpdateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: async (values) => {
      const parsed = formSchema.safeParse(values);
      if (parsed.success) {
        return { values: parsed.data, errors: {} };
      }
      const fieldErrors: Record<string, { type: string; message?: string }> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string" && !fieldErrors[path]) {
          fieldErrors[path] = { type: "validation", message: issue.message };
        }
      }
      return { values: {}, errors: fieldErrors };
    },
    defaultValues: {
      nom: d.nom,
      prenom: d.prenom,
      email: d.email,
      sexe: (d.sexe as "Masculin" | "Féminin" | "Non précisé") ?? "Non précisé",
      age: d.age ?? undefined,
      categorie: (d.categorie as "PRIMAIRE" | "COLLEGIEN" | "UNIVERSITAIRE" | "SALARIE") ?? undefined,
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
      statut: (d.statut as "ACTIF" | "INACTIF") ?? "ACTIF",
    },
  });

  const joursDisponibles = watch("joursDisponibles") ?? [];
  const materielPC = watch("materielPC");
  const accepteRegles = watch("accepteRegles");

  const toggleJour = (jour: string) => {
    const next = joursDisponibles.includes(jour)
      ? joursDisponibles.filter((j) => j !== jour)
      : [...joursDisponibles, jour];
    setValue("joursDisponibles", next);
  };

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const res = await updateUserAction(userId, data);
      if (res.success) {
        toast.success("Profil mis à jour avec succès.");
        router.push(`/admin/users/${userId}`);
      } else {
        toast.error(res.error ?? "Erreur lors de la mise à jour.");
      }
    });
  };

  const fieldClass = "bg-slate-950/60 border-slate-800 text-slate-200 text-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identité */}
      <Section title="Identité">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prénom *" error={errors.prenom?.message}>
            <Input {...register("prenom")} className={fieldClass} />
          </FormField>
          <FormField label="Nom *" error={errors.nom?.message}>
            <Input {...register("nom")} className={fieldClass} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email *" error={errors.email?.message}>
            <Input {...register("email")} type="email" className={fieldClass} />
          </FormField>
          <FormField label="Genre">
            <Select
              value={watch("sexe")}
              onValueChange={(v) => setValue("sexe", v as "Masculin" | "Féminin" | "Non précisé")}
            >
              <SelectTrigger className={`${fieldClass} h-9`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="Masculin">Masculin</SelectItem>
                <SelectItem value="Féminin">Féminin</SelectItem>
                <SelectItem value="Non précisé">Non précisé</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Matricule *" error={errors.matricule?.message}>
            <Input {...register("matricule")} className={fieldClass} />
          </FormField>
          <FormField label="Téléphone *" error={errors.telephone?.message}>
            <Input {...register("telephone")} className={fieldClass} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date de naissance">
            <Input {...register("dateNaissance")} type="date" className={fieldClass} />
          </FormField>
          <FormField label="Âge">
            <Input {...register("age")} type="number" min={1} max={120} className={fieldClass} />
          </FormField>
        </div>
      </Section>

      {/* Scolarité / Société */}
      <Section title="Scolarité / Société">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="École">
            <Input {...register("etablissement")} className={fieldClass} />
          </FormField>
          <FormField label="Société">
            <Input {...register("societe")} className={fieldClass} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Catégorie">
            <Select
              value={watch("categorie") ?? ""}
              onValueChange={(v) =>
                setValue("categorie", v as "PRIMAIRE" | "COLLEGIEN" | "UNIVERSITAIRE" | "SALARIE")
              }
            >
              <SelectTrigger className={`${fieldClass} h-9`}>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
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

      {/* Contact */}
      <Section title="Contact">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Profil social (URL)">
            <Input {...register("socialProfile")} type="url" className={fieldClass} />
          </FormField>
          <FormField label="Site web (URL)">
            <Input {...register("siteWeb")} type="url" className={fieldClass} />
          </FormField>
        </div>
        <FormField label="Contact d'urgence">
          <Input {...register("contactUrgence")} className={fieldClass} />
        </FormField>
        <FormField label="Facebook">
          <Input {...register("facebook")} className={fieldClass} />
        </FormField>
      </Section>

      {/* Disponibilités */}
      <Section title="Disponibilités">
        <div className="flex flex-wrap gap-3">
          {JOURS.map((jour) => (
            <label key={jour} className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
              <Checkbox
                checked={joursDisponibles.includes(jour)}
                onCheckedChange={() => toggleJour(jour)}
              />
              {JOURS_FR[jour]}
            </label>
          ))}
        </div>
      </Section>

      {/* Pièces jointes */}
      <Section title="Pièces jointes">
        <FormField label="URL du CV (PDF)" error={errors.cvUrl?.message}>
          <Input {...register("cvUrl")} className={fieldClass} placeholder="https://..." />
        </FormField>
        <FormField label="URL du certificat (PDF)" error={errors.certificatUrl?.message}>
          <Input {...register("certificatUrl")} className={fieldClass} placeholder="https://..." />
        </FormField>
      </Section>

      {/* Règles & Équipement */}
      <Section title="Règles &amp; Équipement">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={materielPC}
              onCheckedChange={(v) => setValue("materielPC", Boolean(v))}
            />
            <span className="text-sm text-slate-300">Dispose d&apos;un PC personnel</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={accepteRegles}
              onCheckedChange={(v) => setValue("accepteRegles", Boolean(v))}
            />
            <span className="text-sm text-slate-300">A accepté les règles de l&apos;association</span>
          </label>
        </div>
      </Section>

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
          disabled={isPending}
          className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-300">{label}</Label>
      {children}
      {error && <p className="text-red-400 text-[11px]">{error}</p>}
    </div>
  );
}
