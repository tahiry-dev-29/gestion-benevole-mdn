"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { submitTemoignage } from "./temoignage.action";

export function TemoignageForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(formData: FormData) {
    if (pending) return;
    setPending(true);
    const result = await submitTemoignage({
      nom_auteur: formData.get("nom_auteur")?.toString(),
      contenu: formData.get("contenu")?.toString() ?? "",
      website: formData.get("website")?.toString() ?? "",
    });
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setSent(true);
    toast.success("Merci, votre témoignage sera publié après modération.");
  }

  if (sent)
    return (
      <p role="status">Merci, votre témoignage sera publié après modération.</p>
    );

  return (
    <form action={submit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Votre nom (facultatif)
        <Input name="nom_auteur" maxLength={80} autoComplete="name" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Votre témoignage
        <textarea
          className="min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
          name="contenu"
          minLength={20}
          maxLength={2000}
          required
        />
      </label>
      <label className="hidden" aria-hidden="true">
        Site web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer mon témoignage"}
      </Button>
    </form>
  );
}
