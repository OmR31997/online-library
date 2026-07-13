import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

// Edge-safe helper to decode JWT payload without server-side Node-native crypto signatures
function decodeJwtPayload(token: string): { exp?: number; role?: string; userId?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Decode base64url payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieName = process.env.NODE_ENV === "production" ? "__Host-auth-token" : "auth-token";
  const token = request.cookies.get(cookieName)?.value;

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(cookieName);
      return response;
    }

    // Expiry check
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(cookieName);
      return response;
    }

    // Admin authorization check
    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuthRoute && token) {
    const payload = decodeJwtPayload(token);
    if (payload) {
      const now = Math.floor(Date.now() / 1000);
      if (!payload.exp || payload.exp > now) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
