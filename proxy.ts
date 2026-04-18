import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isAuthenticated = !!accessToken || !!refreshToken;

  const publicPaths = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ];

  const isPublicPath = pathname === "/" || publicPaths.some((path) => pathname.startsWith(path));

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
