"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { moderateTemoignage } from "./temoignage.action";

export function TemoignageModerationActions({ id }: { id: number }) {
  const [pending, setPending] = useState(false);

  async function moderate(action: "publier" | "rejeter" | "supprimer") {
    if (pending) return;
    setPending(true);
    const result = await moderateTemoignage({ id, action });
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Modération enregistrée.");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={pending} onClick={() => moderate("publier")}>
        Publier
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => moderate("rejeter")}
      >
        Rejeter
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => moderate("supprimer")}
      >
        Supprimer
      </Button>
    </div>
  );
}
