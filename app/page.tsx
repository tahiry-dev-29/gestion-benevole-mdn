import Link from "next/link";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const temoignages = await prisma.temoignage.findMany({
    where: { statut: "PUBLIE" },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, nom_auteur: true, contenu: true },
  });

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
            Application de gestion des bénévoles et des activités associatives
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Button className="w-full" asChild>
            <Link href="/login">Espace administration</Link>
          </Button>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/temoignages">Lire les témoignages</Link>
          </Button>
        </CardContent>
      </Card>
      {temoignages.length > 0 ? (
        <section
          className="mt-8 grid w-full max-w-4xl gap-4 md:grid-cols-3"
          aria-label="Témoignages de la communauté"
        >
          {temoignages.map((temoignage) => (
            <Card key={temoignage.id}>
              <CardContent className="grid gap-2 pt-6">
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {temoignage.contenu}
                </p>
                <p className="text-sm font-medium">{temoignage.nom_auteur}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}
    </main>
  );
}
