import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CategoryType, UserFormData } from "../types";

interface CreateUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  formError: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateUserModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  formError,
  isPending,
  onSubmit,
}: CreateUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Ajouter un utilisateur
          </DialogTitle>
        </DialogHeader>

        {formError && (
          <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-lg">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prenom" className="text-xs text-slate-300">
                Prénom *
              </Label>
              <Input
                id="prenom"
                required
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                placeholder="Ex: Jean"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom" className="text-xs text-slate-300">
                Nom *
              </Label>
              <Input
                id="nom"
                required
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Ex: Dupont"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-slate-300">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="jean.dupont@asso.fr"
              className="bg-slate-950/60 border-slate-800 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    role: (v as "ADMIN" | "BENEVOLE") || "BENEVOLE",
                  })
                }
              >
                <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  <SelectItem value="BENEVOLE">Bénévole</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Genre</Label>
              <Select
                value={formData.sexe}
                onValueChange={(v) =>
                  setFormData({ ...formData, sexe: v ?? "" })
                }
              >
                <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200 h-9">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  <SelectItem value="Masculin">Masculin</SelectItem>
                  <SelectItem value="Féminin">Féminin</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-xs text-slate-300">
                Âge
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="25"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact" className="text-xs text-slate-300">
                Contact
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="034 00 000 00"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300">Catégorie</Label>
            <Select
              value={formData.categorie}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  categorie: (v as CategoryType) || "",
                })
              }
            >
              <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200 h-9">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                <SelectItem value="COLLEGIEN">Collégien</SelectItem>
                <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                <SelectItem value="SALARIE">Salarié</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="etablissement" className="text-xs text-slate-300">
                Établissement
              </Label>
              <Input
                id="etablissement"
                value={formData.etablissement}
                onChange={(e) =>
                  setFormData({ ...formData, etablissement: e.target.value })
                }
                placeholder="Lycée / Université"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="facebook" className="text-xs text-slate-300">
                Facebook
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) =>
                  setFormData({ ...formData, facebook: e.target.value })
                }
                placeholder="Lien ou Nom Facebook"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium gap-2"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Créer l&apos;utilisateur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
