import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { canAccessRoute, isRole } from "@/lib/rbac";

const PUBLIC_PATHS = [
  "/login",
  "/api",
  "/_next",
  "/activites",
  "/partages",
  "/temoignages",
];
const PUBLIC_FILES = new Set([
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
  "/sw.js",
  "/~offline",
]);
const PUBLIC_FILE_PREFIXES = ["/workbox-", "/fallback-"];

function isPublic(pathname: string) {
  return (
    PUBLIC_FILES.has(pathname) ||
    PUBLIC_FILE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname === "/"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (
      !isRole(token.role) ||
      token.statut === "INACTIF" ||
      !canAccessRoute(pathname, token.role)
    ) {
      return NextResponse.rewrite(new URL("/forbidden", request.url));
    }
    return NextResponse.next();
  }

  if (!isPublic(pathname) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (token?.statut === "INACTIF" && !isPublic(pathname)) {
    return NextResponse.rewrite(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
