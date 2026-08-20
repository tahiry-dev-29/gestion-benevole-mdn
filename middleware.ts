import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques (pas d'authentification requise)
  const publicRoutes = [
    "/api/auth",
    "/api/public",
    "/_next",
    "/static",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.json",
    "/login",
    "/register",
    "/reset-password",
  ];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Route publique - pas de vérification nécessaire
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Routes admin protégées
  const isAdminRoute = pathname.startsWith("/admin");

  // Récupérer le token d'authentification
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Si pas de token et accès à une route protégée, rediriger vers login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si accès admin mais pas le rôle ADMIN, rediriger vers dashboard
  if (isAdminRoute && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths that are not:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - robots.txt (search engine config)
     * - manifest.json (PWA manifest)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
  ],
};