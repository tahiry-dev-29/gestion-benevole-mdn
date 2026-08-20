import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques (pas d'authentification requise)
  const publicRoutes = [
    "/api/auth",
    "/login",
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.json",
    "/api/public",
  ];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Route publique - pas de vérification nécessaire
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Récupérer le token d'authentification
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Si pas de token et accès à une route protégée, rediriger vers login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
  ],
};