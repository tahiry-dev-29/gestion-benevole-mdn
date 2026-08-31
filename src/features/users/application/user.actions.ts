'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { userRepository } from '../infrastructure/user.repository';
import {
  createUserSchema,
  updateUserSchema,
  CreateUserSchemaInput,
  UpdateUserSchemaInput,
} from './user.schema';

export async function getUsersAction() {
  try {
    const users = await userRepository.findAll();
    return { success: true, data: users };
  } catch {
    return { success: false, error: 'Impossible de récupérer la liste des utilisateurs.' };
  }
}

export async function createUserAction(input: CreateUserSchemaInput) {
  try {
    const validated = createUserSchema.parse(input);

    const existingUser = await userRepository.findByEmail(validated.email);
    if (existingUser) {
      return { success: false, error: 'Un utilisateur avec cet email existe déjà.' };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const newUser = await userRepository.create({
      ...validated,
      password: hashedPassword,
    });

    revalidatePath('/dashboard/users');
    return { success: true, data: newUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la création.';
    return { success: false, error: message };
  }
}

export async function updateUserAction(id: string, input: UpdateUserSchemaInput) {
  try {
    const validated = updateUserSchema.parse(input);
    const updateData: Record<string, unknown> = { ...validated };

    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 10);
    }

    const updatedUser = await userRepository.update(id, updateData);

    revalidatePath('/dashboard/users');
    return { success: true, data: updatedUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.';
    return { success: false, error: message };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await userRepository.delete(id);
    revalidatePath('/dashboard/users');
    return { success: true };
  } catch {
    return { success: false, error: 'Erreur lors de la suppression de l\'utilisateur.' };
  }
}