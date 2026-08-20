"use server";

import bcryptjs from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { type RegisterInput,registerSchema } from "./auth.schema";

export type RegisterResult =
  | { success: true }
  | { success: false; error: string; issues?: unknown };

export async function registerAction(
  data: RegisterInput
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
      issues: parsed.error.flatten(),
    };
  }

  const { prenom, nom, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return { success: false, error: "Un compte existe déjà avec cet email." };
  }

  const hashed = await bcryptjs.hash(password, 10);

  await prisma.user.create({
    data: {
      prenom,
      nom,
      email: email.toLowerCase(),
      password: hashed,
      role: "BENEVOLE",
    },
  });

  return { success: true };
}