import { beforeEach, describe, expect, it, vi } from "vitest";

const getTokenMock = vi.hoisted(() => vi.fn());

vi.mock("next-auth/jwt", () => ({ getToken: getTokenMock }));

import { NextRequest } from "next/server";

import { proxy } from "../../proxy";

function request(path: string) {
  return new NextRequest(`https://gestion-benevole.test${path}`);
}

describe("proxy — contrôle d'accès et ressources publiques", () => {
  beforeEach(() => {
    getTokenMock.mockReset();
  });

  it.each([
    ["SUPER_ADMIN", "/admin/dashboard"],
    ["ADMIN", "/admin/users"],
    ["VOLUNTEER", "/admin/dashboard"],
    ["VOLUNTEER", "/admin/volunteer-management"],
  ])("autorise %s sur %s", async (role, path) => {
    getTokenMock.mockResolvedValue({ role, statut: "ACTIF" });

    const response = await proxy(request(path));

    expect(response?.headers.get("x-middleware-next")).toBe("1");
  });

  it.each([
    ["USER", "/admin/dashboard"],
    ["VOLUNTEER", "/admin/users"],
    ["ADMIN", "/admin/route-inconnue"],
  ])("refuse %s sur %s", async (role, path) => {
    getTokenMock.mockResolvedValue({ role, statut: "ACTIF" });

    const response = await proxy(request(path));

    expect(response?.headers.get("x-middleware-rewrite")).toContain(
      "/forbidden"
    );
  });

  it("bloque une session inactive et redirige une session absente", async () => {
    getTokenMock.mockResolvedValue({ role: "ADMIN", statut: "INACTIF" });
    const inactiveResponse = await proxy(request("/admin/dashboard"));
    expect(inactiveResponse?.headers.get("x-middleware-rewrite")).toContain(
      "/forbidden"
    );

    getTokenMock.mockResolvedValue(null);
    const anonymousResponse = await proxy(request("/admin/dashboard"));
    expect(anonymousResponse?.status).toBe(307);
    expect(anonymousResponse?.headers.get("location")).toContain("/login");
  });

  it.each([
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
    "/sw.js",
    "/workbox-runtime.js",
    "/fallback-offline.js",
    "/~offline",
    "/activites",
  ])("laisse accessible la ressource publique %s", async (path) => {
    getTokenMock.mockResolvedValue(null);

    const response = await proxy(request(path));

    expect(response?.headers.get("x-middleware-next")).toBe("1");
  });
});
