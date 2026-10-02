import { z } from "zod";

/** Rôles administrables dans `/admin/volunteer-management` (`USER` exclu). */
export const VOLUNTEER_ROLES = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"] as const;

export const volunteerRoleSchema = z.enum(VOLUNTEER_ROLES);
export const volunteerStatutSchema = z.enum(["ACTIF", "INACTIF"]);

export const createVolunteerSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100),
  role: volunteerRoleSchema,
  dateEntree: z.string().optional(),
  statut: volunteerStatutSchema.default("ACTIF"),
});

export const updateVolunteerSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100)
    .optional(),
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100)
    .optional(),
  email: z.string().email("Adresse email invalide").optional(),
  password: z.string().max(100).optional(),
  role: volunteerRoleSchema.optional(),
  dateEntree: z.string().optional(),
  statut: volunteerStatutSchema.optional(),
});

export const setStatutSchema = z.object({
  id: z.number().int().positive(),
  statut: volunteerStatutSchema,
});

export type CreateVolunteerInput = z.input<typeof createVolunteerSchema>;
export type UpdateVolunteerInput = z.input<typeof updateVolunteerSchema>;
export type CreateVolunteerData = z.output<typeof createVolunteerSchema>;
export type UpdateVolunteerData = z.output<typeof updateVolunteerSchema>;
export type SetStatutInput = z.infer<typeof setStatutSchema>;
