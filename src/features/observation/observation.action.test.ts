import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  observationFindUnique: vi.fn(),
  observationFindMany: vi.fn(),
  observationCount: vi.fn(),
  observationCreate: vi.fn(),
  observationUpdate: vi.fn(),
  observationDelete: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next-auth", () => ({ getServerSession: mocks.getServerSession }));
vi.mock("@/lib/auth-options", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    observation: {
      findUnique: mocks.observationFindUnique,
      findMany: mocks.observationFindMany,
      count: mocks.observationCount,
      create: mocks.observationCreate,
      update: mocks.observationUpdate,
      delete: mocks.observationDelete,
    },
  },
}));

import {
  createObservationAction,
  deleteObservationAction,
  updateObservationAction,
} from "./observation.action";
import { listObservationsAction } from "./observation-queries.action";

describe("observation actions and access controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("access control & RBAC", () => {
    it("rejects unauthenticated users", async () => {
      mocks.getServerSession.mockResolvedValue(null);
      const listRes = await listObservationsAction();
      expect(listRes).toEqual({ success: false, error: "Non authentifié." });

      const createRes = await createObservationAction({
        userId: 1,
        mois: 10,
        annee: 2026,
        contenu: "Très bon travail ce mois-ci.",
      });
      expect(createRes).toEqual({ success: false, error: "Non authentifié." });
    });

    it("rejects non-admin volunteer users from listing or creating observations", async () => {
      mocks.getServerSession.mockResolvedValue({
        user: { id: "10", role: "VOLUNTEER" },
      });
      const listRes = await listObservationsAction();
      expect(listRes).toEqual({
        success: false,
        error: "Accès interdit (403).",
      });

      const createRes = await createObservationAction({
        userId: 1,
        mois: 10,
        annee: 2026,
        contenu: "Très bon travail ce mois-ci.",
      });
      expect(createRes).toEqual({
        success: false,
        error: "Accès interdit (403).",
      });
      expect(mocks.observationCreate).not.toHaveBeenCalled();
    });
  });

  describe("uniqueness enforcement", () => {
    it("rejects creating duplicate observation for same user, month, year", async () => {
      mocks.getServerSession.mockResolvedValue({
        user: { id: "1", role: "ADMIN" },
      });
      mocks.observationFindUnique.mockResolvedValue({
        id: 99,
        user_id: 5,
        mois: 10,
        annee: 2026,
      });

      const result = await createObservationAction({
        userId: 5,
        mois: 10,
        annee: 2026,
        contenu: "Observation supplémentaire.",
      });

      expect(result).toEqual({
        success: false,
        error: "Une observation existe déjà pour ce bénévole en 10/2026.",
      });
      expect(mocks.observationCreate).not.toHaveBeenCalled();
    });

    it("creates observation when no duplicate exists", async () => {
      mocks.getServerSession.mockResolvedValue({
        user: { id: "1", role: "ADMIN" },
      });
      mocks.observationFindUnique.mockResolvedValue(null);
      mocks.observationCreate.mockResolvedValue({
        id: 101,
        user_id: 5,
        auteur_id: 1,
        mois: 10,
        annee: 2026,
        contenu: "Participation exemplaire aux activités.",
      });

      const result = await createObservationAction({
        userId: 5,
        mois: 10,
        annee: 2026,
        contenu: "Participation exemplaire aux activités.",
      });

      expect(result.success).toBe(true);
      expect(mocks.observationCreate).toHaveBeenCalledWith({
        data: {
          user_id: 5,
          auteur_id: 1,
          mois: 10,
          annee: 2026,
          contenu: "Participation exemplaire aux activités.",
        },
        include: {
          user: { select: { id: true, nom: true, prenom: true } },
          auteur: { select: { id: true, nom: true, prenom: true } },
        },
      });
    });
  });

  describe("update and delete authorizations", () => {
    it("allows the author to update their observation", async () => {
      mocks.getServerSession.mockResolvedValue({
        user: { id: "42", role: "VOLUNTEER" },
      });
      mocks.observationFindUnique.mockResolvedValue({
        id: 7,
        auteur_id: 42,
        user_id: 5,
      });
      mocks.observationUpdate.mockResolvedValue({
        id: 7,
        contenu: "Mise à jour du commentaire.",
      });

      const result = await updateObservationAction({
        observationId: 7,
        contenu: "Mise à jour du commentaire.",
      });

      expect(result.success).toBe(true);
      expect(mocks.observationUpdate).toHaveBeenCalled();
    });

    it("prevents a user who is not author nor admin from updating", async () => {
      mocks.getServerSession.mockResolvedValue({
        user: { id: "99", role: "VOLUNTEER" },
      });
      mocks.observationFindUnique.mockResolvedValue({
        id: 7,
        auteur_id: 42,
        user_id: 5,
      });

      const result = await updateObservationAction({
        observationId: 7,
        contenu: "Tentative non autorisée.",
      });

      expect(result).toEqual({
        success: false,
        error: "Accès interdit (403).",
      });
      expect(mocks.observationUpdate).not.toHaveBeenCalled();
    });

    it("allows admin to delete any observation", async () => {
      mocks.getServerSession.mockResolvedValue({
        user: { id: "1", role: "SUPER_ADMIN" },
      });
      mocks.observationFindUnique.mockResolvedValue({
        id: 7,
        auteur_id: 42,
        user_id: 5,
      });
      mocks.observationDelete.mockResolvedValue({ id: 7 });

      const result = await deleteObservationAction({ observationId: 7 });
      expect(result.success).toBe(true);
      expect(mocks.observationDelete).toHaveBeenCalledWith({
        where: { id: 7 },
      });
    });
  });
});
