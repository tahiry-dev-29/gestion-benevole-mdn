import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemoignageForm } from "@/features/temoignage/temoignage-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Témoignages | Gestion Bénévole",
  description:
    "Découvrez les témoignages de notre communauté et partagez votre expérience.",
};

export const dynamic = "force-dynamic";

export default async function TemoignagesPage() {
  const temoignages = await prisma.temoignage.findMany({
    where: { statut: "PUBLIE" },
    orderBy: { createdAt: "desc" },
    select: { id: true, nom_auteur: true, contenu: true },
  });

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12">
      <header className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Témoignages</h1>
        <p className="text-muted-foreground">
          Les expériences partagées par notre communauté.
        </p>
      </header>
      <section
        aria-label="Témoignages publiés"
        className="grid gap-4 md:grid-cols-2"
      >
        {temoignages.length === 0 ? (
          <p className="text-muted-foreground">
            Les premiers témoignages seront bientôt publiés.
          </p>
        ) : null}
        {temoignages.map((temoignage) => (
          <Card key={temoignage.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  {temoignage.nom_auteur.charAt(0).toLocaleUpperCase()}
                </span>
                {temoignage.nom_auteur}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {temoignage.contenu}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-2xl gap-5">
        <div className="grid gap-2">
          <h2 className="text-2xl font-semibold">Partagez votre expérience</h2>
          <p className="text-muted-foreground">
            Votre témoignage sera publié après validation par notre équipe.
          </p>
        </div>
        <TemoignageForm />
      </section>
    </main>
  );
}
