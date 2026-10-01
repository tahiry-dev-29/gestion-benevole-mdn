import { z } from "zod";

const activiteFields = {
  titre: z.string().trim().min(1, "Le titre est requis").max(150),
  description: z
    .string()
    .trim()
    .min(1, "La description est requise")
    .max(10000),
  date: z.string().datetime({ offset: true }).or(z.string().date()),
  image: z
    .union([
      z.string().regex(/^\/uploads\/[a-f0-9-]+\.(?:jpg|png|webp)$/i),
      z
        .string()
        .url()
        .max(2048)
        .refine((value) => {
          try {
            const url = new URL(value);
            return (
              url.protocol === "https:" &&
              url.hostname.endsWith(".public.blob.vercel-storage.com")
            );
          } catch {
            return false;
          }
        }),
      z.literal(""),
    ])
    .optional(),
  statut: z.enum(["BROUILLON", "PUBLIE"]),
};

export const createActiviteSchema = z.object(activiteFields).extend({
  statut: activiteFields.statut.default("BROUILLON"),
});

export const updateActiviteSchema = z.object(activiteFields).partial();
export const publicationSchema = z.object({ statut: activiteFields.statut });
export type CreateActiviteDto = z.infer<typeof createActiviteSchema>;
export type UpdateActiviteDto = z.infer<typeof updateActiviteSchema>;
