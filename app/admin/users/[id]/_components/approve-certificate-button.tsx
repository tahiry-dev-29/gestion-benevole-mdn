"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { approveCertificateAction } from "@/features/user/user.action";

export function ApproveCertificateButton({ userId }: { userId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const approve = useMutation({
    mutationFn: async () => {
      const result = await approveCertificateAction({ userId });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Certificat approuvé; le compte est maintenant bénévole.");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button
      type="button"
      size="sm"
      disabled={approve.isPending}
      onClick={() => approve.mutate()}
      className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 text-xs"
    >
      {approve.isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Check className="size-3.5" />
      )}
      Approuver
    </Button>
  );
}
