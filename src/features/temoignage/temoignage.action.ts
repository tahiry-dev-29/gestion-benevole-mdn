"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { moderationSchema, temoignageSchema } from "./temoignage.schema";

const globalForRateLimit = globalThis as typeof globalThis & {
  temoignageSubmissions?: Map<string, number[]>;
};
const submissions =
  globalForRateLimit.temoignageSubmissions ?? new Map<string, number[]>();
globalForRateLimit.temoignageSubmissions = submissions;
const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS = 3;

function isAdminRole(role: string | undefined) {
  return role === "ADMIN";
}

export async function submitTemoignage(input: unknown) {
  const parsed = temoignageSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Vérifiez les champs du formulaire." };
  if (parsed.data.website) return { success: true };

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter(
    (time) => now - time < WINDOW_MS
  );
  if (recent.length >= MAX_SUBMISSIONS) {
    return {
      success: false,
      error: "Trop d’envois. Réessayez dans une minute.",
    };
  }
  try {
    await prisma.temoignage.create({
      data: {
        nom_auteur: parsed.data.nom_auteur || "Anonyme",
        contenu: parsed.data.contenu,
        statut: "EN_ATTENTE",
      },
    });
    recent.push(now);
    submissions.set(ip, recent);
    revalidatePath("/temoignages");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Impossible d’enregistrer le témoignage." };
  }
}

export async function moderateTemoignage(input: unknown) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role))
    return { success: false, error: "Accès refusé." };
  const parsed = moderationSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Action invalide." };

  try {
    if (parsed.data.action === "supprimer") {
      await prisma.temoignage.delete({ where: { id: parsed.data.id } });
    } else {
      await prisma.temoignage.update({
        where: { id: parsed.data.id },
        data: {
          statut: parsed.data.action === "publier" ? "PUBLIE" : "REJETE",
        },
      });
    }
    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Impossible de modérer ce témoignage." };
  }
}
