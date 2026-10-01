"use client";

import { useState } from "react";
import { Download, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Dataset = "users" | "presences";
type ImportError = { ligne: number; champ: string; message: string };

export function ImportExportButtons({ dataset }: { dataset: Dataset }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [imported, setImported] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const label = dataset === "users" ? "utilisateurs" : "présences";

  async function download(url: string, filename: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Téléchargement impossible.");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error("Impossible de télécharger le fichier.");
    }
  }

  async function handleImport() {
    if (!file) return;
    setPending(true);
    setErrors([]);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch(`/api/import/${dataset}`, { method: "POST", body: form });
      const result = (await response.json()) as { success: boolean; imported: number; errors: ImportError[] };
      setImported(result.imported);
      setErrors(result.errors);
      if (result.imported > 0) toast.success(`${result.imported} ${label} importé(s).`);
      if (result.errors.length > 0) toast.error(`${result.errors.length} erreur(s) à corriger.`);
      if (result.success) setFile(null);
    } catch {
      toast.error("Échec de l’import du fichier.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => download(`/api/export/${dataset}`, `${dataset}.xlsx`)}>
        <Download /> Exporter
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}><FileUp /> Importer</DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importer des {label}</DialogTitle>
            <DialogDescription>Choisissez un fichier XLSX (5 Mo maximum). Les lignes sont validées avant leur enregistrement.</DialogDescription>
          </DialogHeader>
          <Button variant="link" className="w-fit px-0" onClick={() => download(`/api/export/${dataset}?template=1`, `modele-${dataset}.xlsx`)}>
            <Download /> Télécharger le modèle
          </Button>
          <Input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setImported(null); setErrors([]); }} />
          {imported !== null && <p className="text-sm">{imported} ligne(s) importée(s).</p>}
          {errors.length > 0 && <div className="max-h-64 overflow-auto rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Ligne</TableHead><TableHead>Champ</TableHead><TableHead>Erreur</TableHead></TableRow></TableHeader>
              <TableBody>{errors.map((error, index) => <TableRow key={`${error.ligne}-${error.champ}-${index}`}><TableCell>{error.ligne || "—"}</TableCell><TableCell>{error.champ}</TableCell><TableCell>{error.message}</TableCell></TableRow>)}</TableBody>
            </Table>
          </div>}
          <DialogFooter>
            <Button disabled={!file || pending} onClick={handleImport}>{pending ? <Loader2 className="animate-spin" /> : <FileUp />} Importer le fichier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
