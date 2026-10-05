import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/excel/excel.access", () => ({
  hasExcelAdminAccess: vi.fn().mockResolvedValue(false),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findMany: vi.fn() },
    attendance: { findMany: vi.fn() },
  },
}));

import { GET as exportPresences } from "../../../app/api/export/presences/route";
import { GET as exportUsers } from "../../../app/api/export/users/route";
import { POST as importPresences } from "../../../app/api/import/presences/route";
import { POST as importUsers } from "../../../app/api/import/users/route";

describe("protected Excel routes", () => {
  it("returns 403 for a VOLUNTEER without reading or writing data", async () => {
    const request = new Request("http://localhost/api/import/users", {
      method: "POST",
      body: new FormData(),
    });
    const responses = await Promise.all([
      exportUsers(new Request("http://localhost/api/export/users")),
      exportPresences(new Request("http://localhost/api/export/presences")),
      importUsers(request),
      importPresences(
        new Request("http://localhost/api/import/presences", {
          method: "POST",
          body: new FormData(),
        })
      ),
    ]);

    expect(responses.map(({ status }) => status)).toEqual([403, 403, 403, 403]);
  });
});
