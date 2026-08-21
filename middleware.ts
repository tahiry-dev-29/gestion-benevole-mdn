import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const NEXT_PUBLIC_PATHS = ["/admin/login", "/api", "/_next"];

function isPublic(pathname: string) {
  return (
    NEXT_PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    ) || pathname === "/"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });

  // Routes protégées : non connecté -> /admin/login
  if (pathname.startsWith("/admin")) {
    // Allow /admin/login without auth
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // RBAC : seuls les ADMIN accèdent à /admin
    if (token.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/forbidden", request.url));
    }
    return NextResponse.next();
  }

  if (!isPublic(pathname) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
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