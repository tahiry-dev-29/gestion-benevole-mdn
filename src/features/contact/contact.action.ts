"use server";

import { contactSchema, ContactInput } from "./contact.schema";

export async function sendContactMessageAction(data: ContactInput) {
  const validated = contactSchema.parse(data);
  return { success: true, data: validated };
}
