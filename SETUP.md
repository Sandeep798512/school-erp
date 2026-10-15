# 🛠️ Complete Setup & Deployment Guide

This guide provides end-to-step instructions for running the **Enterprise School ERP & Public Portal** locally for development, configuring environment variables, and deploying to production.

---

## 📋 System Prerequisites

Ensure you have the following installed on your host machine:

| Component | Minimum Version | Recommended Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` (LTS) | `v20.12.x` or later | Runtime engine for API and build tooling |
| **npm** | `>= 10.0.0` | `v10.5.x` or later | Monorepo workspace package manager |
| **Docker Desktop** | `>= 24.0.0` | Latest | For running PostgreSQL, Redis, and MinIO |
| **Git** | `>= 2.40.0` | Latest | Version control |

---

## ⚙️ Environment Variables Configuration

The platform uses centralized configuration via `.env` files. Both root `.env` and `apps/api/.env` are automatically referenced.

### Default `.env` Specification:

```env
# System Configuration
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1

# Database Configuration (PostgreSQL 16)
DATABASE_URL="postgresql://school_admin:secure_password_123@localhost:5432/school_erp_db?schema=public"

# Redis Cache & Sessions (Redis 7)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Authentication Secrets (Replace with 32+ byte cryptographically random strings in production)
JWT_SECRET=super_secret_jwt_access_key_change_in_production_32bytes
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_change_in_production_32bytes
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Object Storage / File Vault (MinIO S3)
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=school-erp-assets
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# Client Application URL (For CORS Whitelisting)
WEB_APP_URL=http://localhost:3000
```

---

## 🚀 Step-by-Step Local Setup

### Step 1: Open the Project Directory
Open your terminal or VS Code and navigate to the project directory:

```powershell
cd "C:\Users\Er. SANDEEP GAUD\.gemini\antigravity\scratch\school-erp-platform"
```

---

### Step 2: Install Monorepo Dependencies
Install all packages across root, `@school-erp/shared`, `school-erp-api`, and `school-erp-web`:

```bash
npm install
```

---

### Step 3: Launch Supporting Infrastructure (Docker)
The included `docker-compose.yml` launches PostgreSQL 16, Redis 7, and MinIO S3 Object Storage with one command:

```bash
docker-compose up -d
```

To verify that all containers are healthy:
```bash
docker ps
```
You should see:
- `school_erp_postgres` listening on port `5432`
- `school_erp_redis` listening on port `6379`
- `school_erp_minio` listening on ports `9000` (API) & `9001` (Web Console)

---

### Step 4: Synchronize Database & Seed Default Records

Generate the Prisma Client:
```bash
npm run prisma:generate --workspace=apps/api
```

Push the database tables to PostgreSQL:
```bash
npx prisma db push --schema=apps/api/prisma/schema.prisma
```

Seed the default permissions, roles, school structure, and demo accounts:
```bash
npm run seed --workspace=apps/api
```

> **Seeding Output Confirmation:**
> Once finished, the seed script will output the pre-configured credentials:
> - Super Admin: `admin@stxaviers.com` | `Admin@123`
> - Teacher: `teacher@stxaviers.com` | `Teacher@123`
> - Student: `student@stxaviers.com` | `Student@123`
> - Parent: `parent@stxaviers.com` | `Parent@123`
> - Accountant: `accountant@stxaviers.com` | `Accountant@123`

---

### Step 5: Start Development Servers

You have multiple convenient ways to run the platform:

#### Option A: Run Full Stack (Frontend + Backend concurrently)
```bash
npm run dev
```

#### Option B: Run in Separate Terminals (Recommended for active debugging)
- **Terminal 1 (Backend API):**
  ```bash
  npm run dev --workspace=apps/api
  ```
- **Terminal 2 (Frontend React App):**
  ```bash
  npm run dev --workspace=apps/web
  ```

#### Option C: Run Only Web Frontend (No Database Required for visual testing)
If Docker or PostgreSQL is not installed yet and you only want to view the Public Website & UI:
```bash
npm run dev --workspace=apps/web
```

---

## 🌐 Default Ports & URL Endpoints

| Service | Local URL | Credentials / Notes |
| :--- | :--- | :--- |
| **Web Frontend & Portals** | `http://localhost:5173` | Public Website, Admission Forms, Login |
| **Backend REST API** | `http://localhost:4000/api/v1` | Express Modular API |
| **API Health Probe** | `http://localhost:4000/api/v1/health/liveness` | Returns `{ status: "ok" }` |
| **MinIO Storage Console** | `http://localhost:9001` | Username: `minioadmin` \| Password: `minioadmin` |
| **PostgreSQL Database** | `localhost:5432` | DB: `school_erp_db` \| User: `school_admin` |
| **Redis Server** | `localhost:6379` | Cache & Session store |

---

## 🏗️ Production Build & Verification

To verify that all TypeScript code compiles with zero errors and packages build for production:

```bash
npm run build
```

This executes:
1. `tsc --build` for `@school-erp/shared`
2. `tsc` for `school-erp-api`
3. `vite build` for `school-erp-web`

---

## 🐳 Production Deployment Blueprint

For deploying to staging or production servers (AWS EC2, DigitalOcean, VPS, or Kubernetes):

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

This production stack features:
- Multi-stage Docker builds with minimal Alpine Linux images.
- Isolated container network with healthchecks.
- Automated restart policies (`restart: always`).
- Persistent volume storage for PostgreSQL and Redis.

---

## 💾 Database Backup & Disaster Recovery

An automated PowerShell backup script is included in `scripts/backup-db.ps1`:

```powershell
# Create an on-demand timestamped database dump
./scripts/backup-db.ps1
```

Dumps are stored in `./backups/school_erp_backup_YYYYMMDD_HHMMSS.sql`.

---

## ❓ Troubleshooting & FAQs

### 1. `Port 5432 is already in use`
- **Cause**: A local instance of PostgreSQL is already running on your machine.
- **Solution**: Stop your local PostgreSQL service via Windows Services (`services.msc`), or change the container host port mapping in `docker-compose.yml` to `"5433:5432"` and update `DATABASE_URL` in `.env` to port `5433`.

### 2. `Login failed: Authentication failed`
- **Cause**: The API server is not running, or database seeding has not been executed yet.
- **Solution**: Ensure `docker-compose up -d` is running and execute `npm run seed --workspace=apps/api`.

### 3. `Prisma Client out of sync with schema`
- **Solution**: Run `npx prisma generate --schema=apps/api/prisma/schema.prisma`.
