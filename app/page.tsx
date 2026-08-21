"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Rediriger vers login
      router.push("/login");
    } else if (session.user.role === "ADMIN") {
      // Admin vers l'espace admin
      router.push("/admin");
    } else {
      // Bénévole vers son dashboard
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </main>
    );
  }

  // Cette page ne devrait jamais être affichée, mais on garde un fallback
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Package className="size-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Gestion Bénévole
          </CardTitle>
          <CardDescription className="text-base">
            {`Chargement de votre espace...`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Button className="w-full" onClick={() => signIn()}>
            Se connecter
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}