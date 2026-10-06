"use client";

import { useState } from "react";
import { MoreHorizontal, Send, ShieldAlert, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-10"
            disabled={pending}
            aria-label="Actions du témoignage"
          >
            <MoreHorizontal aria-hidden="true" className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={pending}
            onSelect={() => void moderate("publier")}
          >
            <Send aria-hidden="true" /> Publier
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={pending}
            onSelect={() => void moderate("rejeter")}
          >
            <X aria-hidden="true" /> Rejeter
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={pending}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 aria-hidden="true" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} className="glass-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert
                aria-hidden="true"
                className="size-5 text-destructive"
              />
              Supprimer ce témoignage ?
            </DialogTitle>
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
    </>
  );
}
