import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { partageRepository } from "@/features/partages/infrastructure/partage.repository";
import { formatPublicDate } from "@/features/public-content/content-utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partages",
  description:
    "Des ressources et des expériences partagées par notre communauté associative.",
  openGraph: {
    title: "Partages",
    description: "Ressources et expériences de notre communauté.",
  },
};

export default async function PartagesPage() {
  const { data } = await partageRepository.list(
    { page: 1, pageSize: 50 },
    true
  );
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Ressources et témoignages
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Nos partages
        </h1>
        <p className="text-lg text-muted-foreground">
          Des idées, des apprentissages et des ressources partagés par les
          membres de l’association.
        </p>
      </header>
      {data.length ? (
        <div className="space-y-4">
          {data.map((partage) => (
            <article
              key={partage.id}
              className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpenText className="size-5" aria-hidden="true" />
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                {formatPublicDate(partage.datePublication)}
                {partage.auteur ? ` · Par ${partage.auteur}` : ""}
              </p>
              <h2 className="text-2xl font-semibold">{partage.titre}</h2>
              <p className="mt-3 line-clamp-3 whitespace-pre-wrap leading-7 text-muted-foreground">
                {partage.contenu}
              </p>
              <Button asChild variant="link" className="mt-3 h-auto p-0">
                <Link href={`/partages/${partage.id}`}>
                  Lire le partage <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Les premiers partages seront bientôt disponibles.
        </p>
      )}
      <nav className="mt-12 border-t pt-6">
        <Link
          href="/activites"
          className="text-sm font-medium text-primary hover:underline"
        >
          Découvrir nos activités →
        </Link>
      </nav>
    </main>
  );
}
