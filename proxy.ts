import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/api", "/_next", "/forbidden"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

// Routes accessibles uniquement par ADMIN+
const ADMIN_ONLY_PATHS = [
  "/admin/users",
  "/admin/places",
  "/admin/credits",
  "/admin/observations",
  "/admin/statistiques",
  "/admin/parametres",
];

function isAdminOnly(pathname: string) {
  return ADMIN_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // `/` → redirect vers /login (app fermée)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url), 307);
  }

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = token.role as string;
  const statut = token.statut as string;

  // Compte inactif ou USER → forbidden
  if (statut === "INACTIF" || role === "USER") {
    return NextResponse.rewrite(new URL("/forbidden", request.url));
  }

  if (pathname.startsWith("/admin")) {
    // Routes ADMIN+ seulement
    if (isAdminOnly(pathname) && role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/forbidden", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
