"use client";

import { useState } from "react";
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

interface CreateUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formError: string;
  isPending: boolean;
  onSubmit: (data: Record<string, unknown>) => void;
}

const EMPTY = {
  nom: "",
  prenom: "",
  email: "",
  sexe: "",
  matricule: "",
  telephone: "",
  spinneret: "",
  etablissement: "",
  societe: "",
  materielPC: false,
  accepteRegles: false,
};

export function CreateUserModal({
  isOpen,
  onOpenChange,
  formError,
  isPending,
  onSubmit,
}: CreateUserModalProps) {
  const [form, setForm] = useState(EMPTY);

  const set = (key: keyof typeof EMPTY, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = (open: boolean) => {
    if (!open) setForm(EMPTY);
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Créer un compte USER
          </DialogTitle>
          <p className="text-xs text-slate-400">
            Le rôle sera automatiquement défini à <strong>USER</strong>.
          </p>
        </DialogHeader>

        {formError && (
          <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-300 rounded-lg">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Identité */}
          <fieldset className="space-y-3">
            <legend className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Identité *
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prenom" className="text-xs text-slate-300">Prénom *</Label>
                <Input
                  id="prenom"
                  required
                  value={form.prenom}
                  onChange={(e) => set("prenom", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nom" className="text-xs text-slate-300">Nom *</Label>
                <Input
                  id="nom"
                  required
                  value={form.nom}
                  onChange={(e) => set("nom", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Genre</Label>
                <Select value={form.sexe} onValueChange={(v) => set("sexe", v ?? "")}>
                  <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200 h-9">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                    <SelectItem value="Non précisé">Non précisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="matricule" className="text-xs text-slate-300">Matricule *</Label>
                <Input
                  id="matricule"
                  required
                  value={form.matricule}
                  onChange={(e) => set("matricule", e.target.value)}
                  placeholder="N° étudiant unique"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-slate-300">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telephone" className="text-xs text-slate-300">Téléphone / WhatsApp *</Label>
              <Input
                id="telephone"
                required
                value={form.telephone}
                onChange={(e) => set("telephone", e.target.value)}
                placeholder="034 00 000 00"
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>
          </fieldset>

          {/* Scolarité / Société */}
          <fieldset className="space-y-3">
            <legend className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Scolarité / Société
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="etablissement" className="text-xs text-slate-300">École</Label>
                <Input
                  id="etablissement"
                  value={form.etablissement}
                  onChange={(e) => set("etablissement", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="societe" className="text-xs text-slate-300">Société</Label>
                <Input
                  id="societe"
                  value={form.societe}
                  onChange={(e) => set("societe", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="spinneret" className="text-xs text-slate-300">Spinneret *</Label>
              <Input
                id="spinneret"
                required
                value={form.spinneret}
                onChange={(e) => set("spinneret", e.target.value)}
                className="bg-slate-950/60 border-slate-800 text-slate-200"
              />
            </div>
          </fieldset>

          {/* Matériel et règles */}
          <fieldset className="space-y-3">
            <legend className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Équipement &amp; Règles *
            </legend>
            <div className="flex items-center gap-2">
              <Checkbox
                id="materielPC"
                checked={form.materielPC}
                onCheckedChange={(v) => set("materielPC", Boolean(v))}
              />
              <Label htmlFor="materielPC" className="text-xs text-slate-300 cursor-pointer">
                Dispose d&apos;un PC personnel
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="accepteRegles"
                checked={form.accepteRegles}
                onCheckedChange={(v) => set("accepteRegles", Boolean(v))}
              />
              <Label htmlFor="accepteRegles" className="text-xs text-slate-300 cursor-pointer">
                A accepté les règles de l&apos;association *
              </Label>
            </div>
          </fieldset>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
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
              Créer le compte USER
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
