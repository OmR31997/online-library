import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_ALGORITHM = "HS256";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be at least 32 characters long in production!");
  }
  
  // Cache the ephemeral key in global scope so it persists across hot-reloads during the same run
  const globalRef = globalThis as any;
  if (!globalRef.__ephemeralJwtSecret) {
    console.warn("TODO(security): Generating ephemeral JWT secret. Instance-isolated!");
    globalRef.__ephemeralJwtSecret = crypto.randomBytes(32).toString("hex");
  }
  return globalRef.__ephemeralJwtSecret;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

export function signToken(payload: TokenPayload, expiresIn: any = "7d"): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    algorithm: JWT_ALGORITHM as any,
    expiresIn,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret, {
      algorithms: [JWT_ALGORITHM as any],
    });
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}
