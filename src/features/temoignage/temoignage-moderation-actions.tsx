"use client";

import { useState } from "react";
import { toast } from "sonner";

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

import { moderateTemoignage } from "./temoignage.action";

const MESSAGES = {
  publier: "Témoignage publié.",
  rejeter: "Témoignage rejeté.",
  supprimer: "Témoignage supprimé.",
} as const;

export function TemoignageModerationActions({ id }: { id: number }) {
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function moderate(action: "publier" | "rejeter" | "supprimer") {
    if (pending) return;
    setPending(true);
    const result = await moderateTemoignage({ id, action });
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(MESSAGES[action]);
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
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger
          render={<Button size="sm" variant="destructive" disabled={pending} />}
        >
          Supprimer
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Supprimer ce témoignage ?</DialogTitle>
            <DialogDescription>
              L&apos;action est irréversible : le témoignage sera définitivement
              retiré, y compris de la liste publique.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={async () => {
                setConfirmOpen(false);
                await moderate("supprimer");
              }}
            >
              {pending ? "Suppression…" : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
