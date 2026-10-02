"use client";

import { useMutation } from "@tanstack/react-query";
import { ExternalLink, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const uploadResponseSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), url: z.string().min(1) }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

export function PdfUploadField({
  id,
  label,
  type,
  value,
  disabled,
  onUploaded,
  onPendingChange,
}: {
  id: string;
  label: string;
  type: "cv" | "certificat";
  value: string;
  disabled?: boolean;
  onUploaded: (url: string) => void;
  onPendingChange: (pending: boolean) => void;
}) {
  const upload = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.set("file", file);
      body.set("type", type);
      const response = await fetch("/api/upload", { method: "POST", body });
      const result = uploadResponseSchema.safeParse(await response.json());
      if (!result.success) throw new Error("Réponse d’upload invalide.");
      if (!response.ok || !result.data.success) {
        throw new Error(
          result.data.success
            ? "Impossible d’envoyer le fichier."
            : result.data.error
        );
      }
      return result.data.url;
    },
    onMutate: () => onPendingChange(true),
    onSettled: () => onPendingChange(false),
    onSuccess: (url) => {
      onUploaded(url);
      toast.success(`${label} envoyé.`);
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Échec de l’upload."
      ),
  });

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs text-slate-300">
        {label} (PDF, 5 Mo maximum)
      </label>
      <Input
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        disabled={disabled || upload.isPending}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload.mutate(file);
          event.currentTarget.value = "";
        }}
        className="bg-slate-950/60 border-slate-800 text-slate-200 text-sm"
      />
      {upload.isPending ? (
        <p
          role="status"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Loader2 className="size-3.5 animate-spin" /> Envoi en cours…
        </p>
      ) : null}
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 underline"
        >
          <ExternalLink className="size-3.5" /> Voir le PDF
        </a>
      ) : (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileUp className="size-3.5" /> Aucun fichier chargé
        </p>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!value || disabled || upload.isPending}
        onClick={() => onUploaded("")}
        className="h-7 px-2 text-xs"
      >
        Retirer le fichier
      </Button>
    </div>
  );
}
