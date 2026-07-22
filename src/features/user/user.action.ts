"use server";

import { userSchema, UserInput } from "./user.schema";

export async function createUserAction(data: UserInput) {
  const validated = userSchema.parse(data);
  // Server Action implementation placeholder
  return { success: true, user: validated };
}
