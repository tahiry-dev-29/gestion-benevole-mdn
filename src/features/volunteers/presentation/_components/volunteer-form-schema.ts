import type { Role } from "@prisma/client";
import { z } from "zod";

import {
  volunteerRoleSchema,
  volunteerStatutSchema,
} from "../../volunteer.schema";

export type ManagedRole = "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER";

export const volunteerFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100),
  email: z.string().email("Adresse email invalide"),
  password: z.string().max(100).optional(),
  role: volunteerRoleSchema,
  dateEntree: z.string().optional(),
  statut: volunteerStatutSchema,
});

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export type VolunteerFormInitial = {
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut: "ACTIF" | "INACTIF";
  dateEntree: string;
};

function toManagedRole(role: Role): ManagedRole {
  return role === "USER" ? "VOLUNTEER" : role;
}

export { toManagedRole };

export function buildVolunteerDefaults(
  initialData: VolunteerFormInitial | null | undefined,
  fallbackRole: ManagedRole
): VolunteerFormValues {
  return {
    nom: initialData?.nom ?? "",
    prenom: initialData?.prenom ?? "",
    email: initialData?.email ?? "",
    password: "",
    role: initialData ? toManagedRole(initialData.role) : fallbackRole,
    dateEntree: initialData?.dateEntree
      ? initialData.dateEntree.slice(0, 10)
      : "",
    statut: initialData?.statut ?? "ACTIF",
  };
}
