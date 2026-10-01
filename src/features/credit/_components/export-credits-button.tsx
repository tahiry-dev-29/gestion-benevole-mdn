"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ExportCreditsButtonProps {
  mois?: number;
  annee?: number;
}

export function ExportCreditsButton({ mois, annee }: ExportCreditsButtonProps) {
  const [isPending, setIsPending] = React.useState(false);

  async function handleExport() {
    setIsPending(true);
    try {
      const params = new URLSearchParams();
      if (mois) params.set("mois", String(mois));
      if (annee) params.set("annee", String(annee));

      const url = `/api/export/credits${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);

      if (!res.ok) {
        toast.error("Erreur lors de l'export");
        return;
      }

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `credits_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(href);

      toast.success("Export CSV téléchargé");
    } catch {
      toast.error("Erreur réseau lors de l'export");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      disabled={isPending}
      className={isPending ? "gap-2" : undefined}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      Exporter CSV
    </Button>
  );
}
