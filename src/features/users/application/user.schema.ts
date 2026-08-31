import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }).optional(),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  role: z.enum(['ADMIN', 'BENEVOLE', 'RESPONSABLE']).default('BENEVOLE'),
});

export const updateUserSchema = createUserSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;