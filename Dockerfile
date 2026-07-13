# Stage 1: Install dependencies only when needed
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json ./
RUN npm ci --legacy-peer-deps

# Stage 2: Rebuild the source code
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set placeholder environment variables for Next.js build-time compilation
ENV NODE_ENV production
ENV PG_HOST=localhost
ENV PG_PORT=5432
ENV PG_USER=placeholder
ENV PG_PASSWORD=placeholder
ENV PG_DB_NAME=placeholder
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV REDIS_USER=placeholder
ENV REDIS_PASSWORD=placeholder
ENV JWT_SECRET=placeholder-jwt-secret-key-32-chars-long
ENV NEXTAUTH_SECRET=placeholder-nextauth-secret-key-32-chars-long

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 3: Runner stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets and built standalone application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/pem ./pem

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build when output: "standalone" is active
CMD ["node", "server.js"]
