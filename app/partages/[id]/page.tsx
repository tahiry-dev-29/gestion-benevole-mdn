import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenText } from "lucide-react";

import { partageRepository } from "@/features/partages/infrastructure/partage.repository";
import { formatPublicDate } from "@/features/public-content/content-utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

async function getPartage(params: Props["params"]) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return partageRepository.getById(id, true);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const partage = await getPartage(params);
  if (!partage) return { title: "Partage introuvable" };
  const description = partage.contenu.slice(0, 160);
  return {
    title: partage.titre,
    description,
    openGraph: { title: partage.titre, description, type: "article" },
  };
}

export default async function PartageDetailPage({ params }: Props) {
  const partage = await getPartage(params);
  if (!partage) notFound();
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/partages"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Tous les partages
      </Link>
      <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpenText className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatPublicDate(partage.datePublication)}
          {partage.auteur ? ` · Par ${partage.auteur}` : ""}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          {partage.titre}
        </h1>
        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-muted-foreground">
          {partage.contenu}
        </div>
      </article>
      <Link
        href="/activites"
        className="mt-8 inline-flex text-sm font-medium text-primary hover:underline"
      >
        Découvrir aussi nos activités →
      </Link>
    </main>
  );
}
