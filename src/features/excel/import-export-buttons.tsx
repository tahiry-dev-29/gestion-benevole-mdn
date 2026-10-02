"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { ImportErrorsTable } from "./import-errors-table";

type Dataset = "users" | "presences";
type ImportError = { ligne: number; champ: string; message: string };
const importResultSchema = z.object({
  success: z.boolean(),
  imported: z.number().int().nonnegative(),
  errors: z.array(
    z.object({
      ligne: z.number().int(),
      champ: z.string(),
      message: z.string(),
    })
  ),
});

export function ImportExportButtons({
  dataset,
  exportRange,
}: {
  dataset: Dataset;
  exportRange?: { du: string; au: string };
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [imported, setImported] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const label = dataset === "users" ? "utilisateurs" : "présences";

  const downloadMutation = useMutation({
    mutationFn: async ({
      url,
      filename,
    }: {
      url: string;
      filename: string;
    }) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Téléchargement impossible.");
      return { blob: await response.blob(), filename };
    },
    onSuccess: ({ blob, filename }) => {
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    },
    onError: () => toast.error("Impossible de télécharger le fichier."),
  });

  const importMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      const form = new FormData();
      form.set("file", selectedFile);
      const response = await fetch(`/api/import/${dataset}`, {
        method: "POST",
        body: form,
      });
      const parsed = importResultSchema.safeParse(await response.json());
      if (!parsed.success) throw new Error("Réponse d’import invalide.");
      return parsed.data;
    },
    onSuccess: (result) => {
      setImported(result.imported);
      setErrors(result.errors);
      if (result.imported > 0)
        toast.success(`${result.imported} ${label} importé(s).`);
      if (result.errors.length > 0)
        toast.error(`${result.errors.length} erreur(s) à corriger.`);
      if (result.imported > 0) {
        void queryClient.invalidateQueries({
          queryKey: dataset === "users" ? ["users"] : ["attendance"],
        });
      }
      if (result.success) {
        setFile(null);
      }
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Échec de l’import du fichier."
      ),
  });

  function download(url: string, filename: string) {
    downloadMutation.mutate({ url, filename });
  }

  function exportDataset() {
    const query =
      dataset === "presences" && exportRange
        ? `?dateDebut=${encodeURIComponent(exportRange.du)}&dateFin=${encodeURIComponent(exportRange.au)}`
        : "";
    download(`/api/export/${dataset}${query}`, `${dataset}.xlsx`);
  }

  function handleImport() {
    if (!file) return;
    setErrors([]);
    importMutation.mutate(file);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={exportDataset}
        disabled={downloadMutation.isPending}
      >
        {downloadMutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Download />
        )}
        Exporter
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>
          <FileUp /> Importer
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importer des {label}</DialogTitle>
            <DialogDescription>
              Choisissez un fichier XLSX (5 Mo maximum). Les lignes sont
              validées avant leur enregistrement.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="link"
            className="w-fit px-0"
            disabled={downloadMutation.isPending}
            onClick={() =>
              download(
                `/api/export/${dataset}?template=1`,
                `modele-${dataset}.xlsx`
              )
            }
          >
            <Download /> Télécharger le modèle
          </Button>
          <Input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={importMutation.isPending}
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setImported(null);
              setErrors([]);
            }}
          />
          {downloadMutation.isPending ? (
            <p role="status" aria-live="polite" className="text-sm">
              Préparation du téléchargement…
            </p>
          ) : null}
          {imported !== null ? (
            <p role="status" aria-live="polite" className="text-sm">
              {imported} ligne(s) importée(s).
            </p>
          ) : null}
          {errors.length > 0 ? <ImportErrorsTable errors={errors} /> : null}
          <DialogFooter>
            <Button
              disabled={!file || importMutation.isPending}
              onClick={handleImport}
            >
              {importMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FileUp />
              )}{" "}
              Importer le fichier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
