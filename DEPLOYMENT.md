# Deployment & Operations Guide

This is an interactive software engineering learning roadmap, tutorial, and quiz platform built using Next.js, Prisma (PostgreSQL), and Valkey/Redis.

## Requirements
- **Node.js**: `20.x` or later (for local host development)
- **Docker**: `20.10.x` or later
- **Docker Compose**: `v2.x` or later

## Installation & Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd online-library
   ```

2. **Configure environment settings**:
   Copy the example file to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

3. **Install local host dependencies** (Optional, for local node running):
   ```bash
   npm install
   ```

4. **Build and start containerized application**:
   Refer to the Docker and Docker Compose instructions below.

---

## 1. Environment Configuration

The application requires various environment variables for database connectivity, caching, session encryption, and authentication.

### Local Development / Cloud Backends (`.env`)
By default, the root directory's `.env` is loaded by Prisma and next during local dev, which connects directly to your cloud databases (e.g. Aiven PostgreSQL & Valkey).

Make sure the following variables are configured properly:
```ini
# PostgreSQL Database Settings
PG_HOST="your-pg-host.aivencloud.com"
PG_PORT="18936"
PG_USER="avnadmin"
PG_PASSWORD="your-secure-password"
PG_DB_NAME="defaultdb"
PG_SSL_MODE="require"
PG_CA_CERTIFICATE="pem/ca.pem" # Required for SSL verification
PG_CONNECTION_LIMIT="20"

# Valkey / Redis Settings
REDIS_HOST="your-valkey-host.aivencloud.com"
REDIS_PORT="18937"
REDIS_USER="default"
REDIS_PASSWORD="your-valkey-password"

# Security and JWT Session Management
JWT_SECRET="local-development-jwt-secret-key-32-chars-long"
NEXTAUTH_SECRET="local-development-nextauth-secret-key-32-chars-long"
```

> [!NOTE]
> Ensure the public CA certificate used by database connections is located under `pem/ca.pem`. The Docker build is designed to copy this directory into the production image automatically.

---

## 2. Database Migrations and Seeding

Before running the application, you must apply the database migrations to set up the schema and optional seed data (e.g., initial roadmaps, tutorials, and quizzes).

### Run Migrations (Local Host)
To apply migrations on the database defined in your local `.env`:
```bash
# Apply pending database migrations
npx prisma migrate deploy

# Seed initial application data (roadmaps, tutorials, quizzes)
npx prisma db seed
```

### Run Migrations (Via Docker Compose helper)
If you want to apply migrations to the **local database container** running inside Docker Compose, execute:
```bash
docker compose run --rm web npx prisma migrate deploy
docker compose run --rm web npx prisma db seed
```

---

## 3. Running with Docker Compose (Local Stack)

Docker Compose builds the Next.js standalone container and sets up local PostgreSQL and Valkey database containers so you do not need to install them on your host machine.

### Start the Stack
Build and launch all services in detached mode:
```bash
docker compose up -d --build
```
This starts:
- **`online-library-web`** at [http://localhost:3000](http://localhost:3000)
- **`online-library-db`** (PostgreSQL on port `5432` with credentials defined in `docker-compose.yml`)
- **`online-library-redis`** (Valkey on port `6379` with password defined in `docker-compose.yml`)

### Verify Service Health
Check the container status and logs:
```bash
# View running containers and health checks
docker compose ps

# View container logs
docker compose logs -f web
```

### Stop the Stack
To stop and remove containers and networks:
```bash
docker compose down
```
> [!TIP]
> If you want to clear the persistent database volumes to reset the local database, run:
> `docker compose down -v`

---

## 4. Building and Running a Standalone Production Container

If you are deploying to a production environment (like AWS ECS, Google Cloud Run, or Kubernetes) where Postgres and Valkey are managed externally, you only need to run the Next.js application container.

### Step 4.1: Build the Production Image
Run this command from the project root:
```bash
docker build -t online-library:latest .
```

### Step 4.2: Run the Standalone Container
Pass the production database credentials via environment flags (`-e`):
```bash
docker run -d \
  -p 3000:3000 \
  --name online-library-app \
  -e PG_HOST="your-prod-db-host.com" \
  -e PG_PORT="5432" \
  -e PG_USER="postgres" \
  -e PG_PASSWORD="your-prod-db-password" \
  -e PG_DB_NAME="online_library" \
  -e PG_SSL_MODE="require" \
  -e PG_CA_CERTIFICATE="pem/ca.pem" \
  -e REDIS_HOST="your-prod-redis-host.com" \
  -e REDIS_PORT="6379" \
  -e REDIS_USER="default" \
  -e REDIS_PASSWORD="your-prod-redis-password" \
  -e JWT_SECRET="your-super-secret-jwt-key-64-chars" \
  -e NEXTAUTH_SECRET="your-super-secret-auth-key-64-chars" \
  online-library:latest
```

---

## 5. Troubleshooting & Useful Commands

### Next.js Standalone Mode
The Dockerfile utilizes Next.js `standalone` mode (`output: "standalone"` in `next.config.ts`). In this mode, Next.js does not require `node_modules` at runtime. Instead, it generates a minimal server launcher at `.next/standalone/server.js` containing only required dependencies.

### Database Connection Failures
If the web container cannot connect to the database container:
1. Ensure the PostgreSQL container is fully initialized and healthy (`docker compose ps`).
2. Verify that `PG_SSL_MODE` is set to `disable` for local container networking, as the local Postgres container is not configured with SSL certificates by default.
3. Verify the credentials match in both `docker-compose.yml` (for `db`) and environment parameters (for `web`).

---

## 6. Nginx Reverse Proxy Setup

To expose the application on standard web ports (`80` / `443`), install and configure Nginx as a reverse proxy.

### Step 6.1: Install Nginx
On Ubuntu / Debian-based systems:
```bash
sudo apt-get update
sudo apt install nginx -y
```

### Step 6.2: Configure Reverse Proxy
Create or edit your site configuration (e.g., `/etc/nginx/sites-available/online-library`):
```nginx
server {
    listen 80;
    server_name your-domain.com; # Replace with your actual domain or IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Real IP forwarding
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration and restart Nginx:
```bash
# Link to sites-enabled
sudo ln -s /etc/nginx/sites-available/online-library /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx service
sudo systemctl restart nginx
```
