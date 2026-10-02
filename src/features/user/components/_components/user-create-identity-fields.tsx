import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { UserFormData } from "../types";

export function UserCreateIdentityFields({
  value,
  onChange,
}: {
  value: UserFormData;
  onChange: (patch: Partial<UserFormData>) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            required
            value={value.prenom}
            onChange={(e) => onChange({ prenom: e.target.value })}
            placeholder="Ex: Jean"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            required
            value={value.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Ex: Dupont"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          required
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="jean.dupont@asso.fr"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="matricule">Matricule *</Label>
          <Input
            id="matricule"
            required
            value={value.matricule}
            onChange={(e) => onChange({ matricule: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone / WhatsApp *</Label>
          <Input
            id="telephone"
            required
            value={value.telephone}
            onChange={(e) => onChange({ telephone: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}
