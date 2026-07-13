import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signToken, verifyToken, TokenPayload } from "./jwt";

// In production, __Host- requires HTTPS and must be served from the root host (no domain field)
const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-auth-token" : "auth-token";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): boolean {
  // Minimum 8 characters
  return password.length >= 8;
}

export async function setAuthCookie(payload: TokenPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expires immediately
  });
}

export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  if (!tokenCookie || !tokenCookie.value) {
    return null;
  }
  return verifyToken(tokenCookie.value);
}
