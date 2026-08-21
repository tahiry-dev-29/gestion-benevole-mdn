import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Accès refusé</h1>
      <p className="text-sm text-muted-foreground text-center">
        Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.
      </p>
      <Button
        className="w-full sm:w-auto"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Retour à l&apos;accueil
      </Button>
    </main>
  );
}