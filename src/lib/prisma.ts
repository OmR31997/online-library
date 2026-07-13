import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, PoolConfig } from "pg";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const buildDatabaseUrl = (): string => {
  const host = process.env.PG_HOST;
  const port = process.env.PG_PORT;
  const user = process.env.PG_USER;
  const password = process.env.PG_PASSWORD;
  const dbName = process.env.PG_DB_NAME;
  const sslMode = process.env.PG_SSL_MODE || "require";
  const connectionLimit = process.env.PG_CONNECTION_LIMIT || "20";
  const caCert = process.env.PG_CA_CERTIFICATE;

  if (!host || !port || !user || !password || !dbName) {
    throw new Error("Missing PostgreSQL database credentials in environment variables.");
  }

  let url = `postgres://${user}:${password}@${host}:${port}/${dbName}?sslmode=${sslMode}&connection_limit=${connectionLimit}`;
  if (caCert) {
    url += `&sslrootcert=${caCert}`;
  }
  return url;
};

const buildPoolConfig = (connectionString: string): PoolConfig => {
  const config: PoolConfig = { connectionString };

  const caCertPath = process.env.PG_CA_CERTIFICATE;
  if (caCertPath) {
    try {
      const resolvedPath = path.resolve(process.cwd(), caCertPath);
      if (fs.existsSync(resolvedPath)) {
        config.ssl = {
          rejectUnauthorized: true,
          ca: fs.readFileSync(resolvedPath, "utf-8"),
        };
      }
    } catch (e) {
      console.error("Failed to load PG_CA_CERTIFICATE file content:", e);
    }
  }

  return config;
};

const createPrismaClient = () => {
  const connectionString = buildDatabaseUrl();
  const pool = new Pool(buildPoolConfig(connectionString));
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
