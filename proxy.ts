import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { canAccessRoute, isLoginRole } from "./src/lib/rbac";

const PUBLIC_PATHS = ["/login", "/forbidden", "/api", "/_next"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Application fermée : la racine redirige vers /login (aucune landing page).
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const token = await getToken({ req: request });

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    const role = token.role;
    // `USER` (pré-conversion), rôle inconnu ou compte inactif : aucun accès.
    if (!isLoginRole(role) || token.statut === "INACTIF") {
      return NextResponse.rewrite(new URL("/forbidden", request.url));
    }

    if (!canAccessRoute(pathname, role)) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
