"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendContactMessageAction } from "./contact.action";

export function ContactForm() {
  const [formData, setFormData] = useState({ nom: "", email: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendContactMessageAction(formData);
      setStatus("Message envoyé avec succès !");
      setFormData({ nom: "", email: "", message: "" });
    } catch {
      setStatus("Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-slate-900/60 p-6 rounded-xl border border-slate-800">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
        <Input
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          placeholder="Votre nom"
          required
          className="bg-slate-950 border-slate-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="votre@email.com"
          required
          className="bg-slate-950 border-slate-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Votre message..."
          rows={4}
          required
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
        Envoyer le message
      </Button>
      {status && <p className="text-sm text-sky-400 text-center font-medium mt-2">{status}</p>}
    </form>
  );
}
