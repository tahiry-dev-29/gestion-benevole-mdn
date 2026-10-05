import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import type { UserFormData } from "../types";

import { UserCreateIdentityFields } from "./user-create-identity-fields";

function parseCategory(value: string | null): UserFormData["categorie"] {
  switch (value) {
    case "PRIMAIRE":
    case "COLLEGIEN":
    case "UNIVERSITAIRE":
    case "SALARIE":
      return value;
    default:
      return "";
  }
}

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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Ajouter un utilisateur
          </DialogTitle>
        </DialogHeader>

        {formError && (
          <div className="p-3 text-xs rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {formError}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="flex max-h-[80vh] flex-col text-xs"
        >
          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-4">
            <p className="rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Nouveau compte de pré-inscription (USER). Les comptes bénévoles et
              administrateurs se créent dans Gestion bénévole.
            </p>
            <UserCreateIdentityFields
              value={formData}
              onChange={(patch) =>
                setFormData((current) => ({ ...current, ...patch }))
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Genre
                </Label>
                <Select
                  value={formData.sexe}
                  onValueChange={(v) =>
                    setFormData({ ...formData, sexe: v ?? "" })
                  }
                >
                  <SelectTrigger className="min-h-11 bg-background">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                    <SelectItem value="Non précisé">Non précisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="age"
                  className="text-sm font-medium text-foreground"
                >
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
                  className="min-h-11 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="contact"
                  className="text-sm font-medium text-foreground"
                >
                  Contact
                </Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  placeholder="034 00 000 00"
                  className="min-h-11 bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Catégorie
              </Label>
              <Select
                value={formData.categorie}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categorie: parseCategory(v),
                  })
                }
              >
                <SelectTrigger className="min-h-11 bg-background">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                  <SelectItem value="COLLEGIEN">Collégien</SelectItem>
                  <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                  <SelectItem value="SALARIE">Salarié</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="etablissement"
                  className="text-sm font-medium text-foreground"
                >
                  École / établissement
                </Label>
                <Input
                  id="etablissement"
                  value={formData.etablissement}
                  onChange={(e) =>
                    setFormData({ ...formData, etablissement: e.target.value })
                  }
                  placeholder="Lycée / Université"
                  className="min-h-11 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="societe">Société (si applicable)</Label>
                <Input
                  id="societe"
                  value={formData.societe}
                  onChange={(event) =>
                    setFormData({ ...formData, societe: event.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="facebook"
                  className="text-sm font-medium text-foreground"
                >
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                  placeholder="Lien ou Nom Facebook"
                  className="min-h-11 bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={formData.materielPC}
                  onCheckedChange={(value) =>
                    setFormData({ ...formData, materielPC: value === true })
                  }
                />
                <span>Je dispose d&apos;un PC</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={formData.accepteRegles}
                  onCheckedChange={(value) =>
                    setFormData({ ...formData, accepteRegles: value === true })
                  }
                />
                <span>Règles acceptées *</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="spinneret">Spinneret *</Label>
              <Input
                id="spinneret"
                required
                value={formData.spinneret}
                onChange={(event) =>
                  setFormData({ ...formData, spinneret: event.target.value })
                }
              />
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="min-h-11"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-h-11 gap-2"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                Créer l&apos;utilisateur
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
