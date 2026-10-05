import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { activiteRepository } from "@/features/activites/infrastructure/activite.repository";
import { formatPublicDate } from "@/features/public-content/content-utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

async function getActivite(params: Props["params"]) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return activiteRepository.getById(id, true);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const activite = await getActivite(params);
  if (!activite) return { title: "Activité introuvable" };
  return {
    title: activite.titre,
    description: activite.description.slice(0, 160),
    openGraph: {
      title: activite.titre,
      description: activite.description.slice(0, 160),
      ...(activite.image ? { images: [activite.image] } : {}),
    },
  };
}

export default async function ActiviteDetailPage({ params }: Props) {
  const activite = await getActivite(params);
  if (!activite) notFound();
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/activites"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Toutes les activités
      </Link>
      <article className="overflow-hidden rounded-2xl border bg-card">
        {activite.image ? (
          <Image
            src={activite.image}
            alt={`Illustration : ${activite.titre}`}
            width={1440}
            height={810}
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            className="aspect-video w-full object-cover"
          />
        ) : null}
        <div className="space-y-6 p-6 sm:p-10">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            {formatPublicDate(activite.date)}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {activite.titre}
          </h1>
          <div className="whitespace-pre-wrap text-base leading-8 text-muted-foreground">
            {activite.description}
          </div>
        </div>
      </article>
      <Link
        href="/partages"
        className="mt-8 inline-flex text-sm font-medium text-primary hover:underline"
      >
        Explorer les partages de l’association →
      </Link>
    </main>
  );
}
