import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ProfileFormData {
  nom: string;
  prenom: string;
  email: string;
  photo: string;
  sexe: string;
  age: number | "";
  contact: string;
  categorie: string;
  etablissement: string;
  facebook: string;
}

interface ProfileFieldsProps {
  formData: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string | number) => void;
}

export function ProfileFields({ formData, onChange }: ProfileFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="prenom">Prénom</Label>
        <Input
          id="prenom"
          value={formData.prenom}
          onChange={(e) => onChange("prenom", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => onChange("nom", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact">Téléphone / Contact</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => onChange("contact", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sexe">Genre</Label>
        <select
          id="sexe"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.sexe}
          onChange={(e) => onChange("sexe", e.target.value)}
        >
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="age">Âge</Label>
        <Input
          id="age"
          type="number"
          min="1"
          max="120"
          value={formData.age}
          onChange={(e) =>
            onChange("age", e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="categorie">Catégorie</Label>
        <select
          id="categorie"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.categorie}
          onChange={(e) => onChange("categorie", e.target.value)}
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
          onChange={(e) => onChange("etablissement", e.target.value)}
        />
      </div>

      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="facebook">Profil Facebook</Label>
        <Input
          id="facebook"
          placeholder="Ex: https://facebook.com/nom ou Nom complet"
          value={formData.facebook}
          onChange={(e) => onChange("facebook", e.target.value)}
        />
      </div>
    </div>
  );
}
