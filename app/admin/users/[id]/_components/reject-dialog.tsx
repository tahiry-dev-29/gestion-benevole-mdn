"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rejectCertificateAction } from "@/features/user/user.action";

export function RejectDialog({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [motif, setMotif] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const reject = useMutation({
    mutationFn: async () => {
      const result = await rejectCertificateAction({ userId, motif });
      if (!result.success) throw new Error(result.error ?? "Erreur de rejet.");
    },
    onSuccess: () => {
      toast.success("Certificat rejeté.");
      setOpen(false);
      setMotif("");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleReject = () => {
    if (!motif.trim()) return;
    reject.mutate();
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-red-800 text-red-400 hover:bg-red-950/40 gap-1.5 text-xs"
      >
        <X className="size-3.5" />
        Rejeter
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>Rejeter le certificat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            <Label className="text-slate-300 text-xs">Motif de rejet *</Label>
            <Input
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Ex: Document illisible"
              className="bg-slate-950/60 border-slate-800 text-slate-200"
            />
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-slate-400 text-xs"
            >
              Annuler
            </Button>
            <Button
              onClick={handleReject}
              disabled={reject.isPending || !motif.trim()}
              className="bg-red-700 hover:bg-red-600 text-white text-xs"
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
