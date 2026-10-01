import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { activiteRepository } from "@/features/activites/infrastructure/activite.repository";
import { formatPublicDate } from "@/features/public-content/content-utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Activités",
  description: "Découvrez les activités et événements de notre association.",
  openGraph: {
    title: "Activités",
    description: "Les actualités de notre association.",
  },
};

export default async function ActivitesPage() {
  const { data } = await activiteRepository.list(
    { page: 1, pageSize: 50, sortBy: "date", sortDir: "desc" },
    true
  );
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">
          La vie associative
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Nos activités
        </h1>
        <p className="text-lg text-muted-foreground">
          Retrouvez les événements, ateliers et projets que nous partageons avec
          la communauté.
        </p>
      </header>
      {data.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={960}
                  height={540}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="aspect-video w-full object-cover"
                  priority={data[0]?.id === item.id}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted text-primary">
                  <CalendarDays className="size-12" aria-hidden="true" />
                </div>
              )}
              <div className="space-y-3 p-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {formatPublicDate(item.date)}
                </p>
                <h2 className="text-xl font-semibold leading-snug">
                  {item.titre}
                </h2>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <Button
                  asChild
                  variant="link"
                  className="h-auto p-0 text-sky-300"
                >
                  <Link href={`/activites/${item.id}`}>
                    Découvrir <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Les prochaines activités seront annoncées ici.
        </p>
      )}
      <nav className="mt-12 border-t pt-6">
        <Link
          href="/partages"
          className="text-sm font-medium text-sky-300 hover:underline"
        >
          Voir aussi les partages de l’association{" "}
          <ChevronRight className="inline size-4" />
        </Link>
      </nav>
    </main>
  );
}
