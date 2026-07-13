import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const getRedisUrl = (): string => {
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const user = process.env.REDIS_USER || "default";
  const password = process.env.REDIS_PASSWORD;

  if (!host || !port) {
    return "redis://127.0.0.1:6379";
  }

  // Aiven hosts use SSL/TLS connection protocol (rediss://)
  if (password) {
    return `rediss://${user}:${password}@${host}:${port}`;
  }
  return `redis://${host}:${port}`;
};

// Singleton pattern to prevent multiple connections during dev hot-reloads
export const redis =
  globalForRedis.redis ??
  new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Prevent startup crash if Redis is temporarily unreachable
  });

redis.on("error", (error) => {
  // Log generic error to avoid leaking connection URIs/passwords
  console.error("Redis Connection Error: An error occurred in the cache client.");
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
