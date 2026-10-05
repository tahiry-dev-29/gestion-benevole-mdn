import { describe, expect, it } from "vitest";

import { createUserSchema, updateUserSchema } from "./user.schema";

const requiredUser = {
  nom: "Rakoto",
  prenom: "Hery",
  email: "hery@example.com",
  matricule: "U-42",
  telephone: "0340000000",
  materielPC: false,
  accepteRegles: true,
};

describe("USER schemas", () => {
  it("requires an establishment or company at creation and update", () => {
    expect(createUserSchema.safeParse(requiredUser).success).toBe(false);
    expect(
      createUserSchema.safeParse({
        ...requiredUser,
        etablissement: "Université",
      }).success
    ).toBe(true);
    expect(
      updateUserSchema.safeParse({ ...requiredUser, societe: "Association" })
        .success
    ).toBe(true);
    expect(
      updateUserSchema.safeParse({ ...requiredUser, etablissement: "  " })
        .success
    ).toBe(false);
  });
});
