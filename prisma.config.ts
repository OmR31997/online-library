import fs from "fs";
import path from "path";
import { defineConfig } from "prisma/config";

// Manually load .env file variables to process.env for Prisma CLI compatibility
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    });
  }
} catch {
  // Ignore filesystem reading errors
}

// Reconstruct DATABASE_URL dynamically from split env parameters
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
    return "postgresql://placeholder:placeholder@localhost:5432/placeholder";
  }
  
  let url = `postgres://${user}:${password}@${host}:${port}/${dbName}?sslmode=${sslMode}&connection_limit=${connectionLimit}`;
  if (caCert) {
    url += `&sslrootcert=${caCert}`;
  }
  return url;
};

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "npx tsx ./prisma/seed.ts",
  },
  datasource: {
    url: buildDatabaseUrl(),
  },
});
