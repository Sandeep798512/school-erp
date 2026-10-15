# 🏫 Enterprise Multi-Tenant School ERP & Public Portal Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x_LTS-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#)

A high-scale, production-ready, multi-tenant **School Management System (ERP) & Public Institution Portal** designed to seamlessly scale from **600 to 60,000+ students** across multiple schools, campuses, and educational trusts.

---

## 🌟 Key Highlights & Architecture

- **Modular Monolith Architecture**: Domain-driven encapsulation with strict boundaries between domains (Academics, Finance, HR, Operations, Portals).
- **Hard Multi-Tenant Isolation**: Tenant discriminator scoping (`organizationId`, `schoolId`) enforced at ORM middleware, database indexes, and API guards.
- **Role-Based Access Control (RBAC)**: 8 distinct system roles (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `ACCOUNTANT`, `LIBRARIAN`, `STAFF`) with 30+ fine-grained permissions.
- **Stateless JWT Security**: 15-minute access tokens + rotating 7-day refresh tokens backed by Redis session whitelist invalidation.
- **Cinematic Public Web Presence**: Ultra-smooth scroll-triggered entrance animations, animated statistics counters, interactive photo galleries, and real-time admission enquiry intake.

---

## 🗂️ Monorepo Structure

```
school-erp-platform/
├── apps/
│   ├── api/                    # Node.js + Express + Prisma ORM Backend API
│   │   ├── prisma/             # Schema definitions (50+ models) & seed scripts
│   │   └── src/
│   │       ├── common/         # Auth guards, Tenant middleware, Cache & Audit
│   │       └── modules/        # Domain modules (Academics, Finance, HR, Portals, etc.)
│   └── web/                    # React 18 + Vite + Tailwind CSS Frontend Client
│       └── src/
│           ├── components/     # High-fidelity Website & ERP UI components
│           ├── hooks/          # Scroll reveal, responsive animations
│           └── pages/          # Public Website, Login, Portals & Dashboards
├── packages/
│   └── shared/                 # Shared TypeScript models, Zod DTOs, Enums, Roles
├── k6/                         # High-throughput load testing scripts (200+ VUs)
├── scripts/                    # Automated PowerShell DB backup & recovery scripts
├── docker-compose.yml          # Local container stack (PostgreSQL, Redis, MinIO)
└── docker-compose.prod.yml     # Production multi-container orchestration
```

---

## 🔐 Default Demo Login Credentials

Once seeded, you can test all institutional roles with these pre-configured credentials (or use the **1-Click Quick Fill buttons** on the login page):

| Role | Email Address | Password | Permissions & Portal Access |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin@stxaviers.com` | `Admin@123` | Full ERP Control, Settings, RBAC, All Modules |
| 👨‍🏫 **Teacher** | `teacher@stxaviers.com` | `Teacher@123` | Attendance Marking, Homework Evaluation, Marks Entry |
| 🎓 **Student** | `student@stxaviers.com` | `Student@123` | Student Dashboard, Timetable, Homework, Report Cards |
| 👨‍👩‍👦 **Parent** | `parent@stxaviers.com` | `Parent@123` | Child's Attendance, Fee Payment & Invoices, Grades |
| 💼 **Accountant** | `accountant@stxaviers.com` | `Accountant@123` | Fee Collections, Invoices, Receipts, Ledgers, Refunds |

---

## 📦 Implemented Functional Domains (30 Phases Complete)

1. **Identity & Authentication**: Argon2/bcrypt hashing, stateless JWT, session management, password resets.
2. **Multi-Tenant Hierarchy**: Organization trusts, schools, campuses, and academic year calendars.
3. **Public School Portal**: Hero showcase with dynamic counters, Principal's message, Academics, Facilities, Campus Life Gallery, Testimonials, News & Events, Online Enquiry form.
4. **Academic Setup**: Classes, sections, subjects, and teacher-subject allocations.
5. **Student & Parent Lifecycle**: Admission workflow, roll numbers, guardian relationships, transfer certificates (TC).
6. **Teacher & Staff Directorate**: Employee onboarding, department classifications, class teacher mapping.
7. **Attendance Engine**: Bulk class attendance marking (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`), analytics, leave applications.
8. **Finance & Fee Engine**: Fee components, invoice generation, idempotent payment processing (`Idempotency-Key`), receipt generation, and refunds.
9. **Examinations & Report Cards**: Term exam scheduling, class grid marks entry, automated grading scale (CBSE/IB), and report card compilation.
10. **Timetable System**: Weekly scheduling with automated conflict detection (prevents teacher or room double-booking).
11. **Homework & Assignments**: Assignment creation, file attachments, student submission portal, late submission auto-detection, teacher evaluations.
12. **Dedicated User Portals**:
    - **Teacher Console**: Assigned classes, schedules, quick attendance, marks entry.
    - **Student Portal**: Personal schedule, assignments, fees, report cards.
    - **Parent Portal**: Multi-ward monitoring, online fee dues payment, grades.
13. **Operations & Facility Management**:
    - **Library System**: Book cataloging, barcode/ISBN search, loan tracking, automated overdue fines.
    - **Transport & Fleet**: Route fare configuration, vehicle registration, student bus allocation with seating capacity limits.
    - **Inventory & Procurement**: SKU tracking, stock transactions (`IN`/`OUT`/`ADJUSTMENT`), suppliers, and purchase orders.
    - **Document & Certificate Vault**: Template builder with token interpolation (`{{studentName}}`, `{{class}}`, `{{admissionNumber}}`) for Bonafide and Transfer Certificates.
14. **Reporting & Analytics**: Financial collection efficiency %, attendance rate heatmaps, academic grade distribution histograms.
15. **Production Hardening**: Immutable audit trails (`AuditService`), L2 caching (`CacheService`), k6 load test scripts, automated DB backup scripts, and Docker containerization.

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20 LTS or higher
- **Docker Desktop** (for PostgreSQL, Redis, and MinIO)

### 2. Installation
```bash
# Clone and enter the repository
cd school-erp-platform

# Install all monorepo dependencies
npm install
```

### 3. Spin up Containers
```bash
docker-compose up -d
```
*This launches PostgreSQL (`localhost:5432`), Redis (`localhost:6379`), and MinIO (`localhost:9000` & Console `localhost:9001`).*

### 4. Push Schema & Seed Initial Data
```bash
# Push database tables
npx prisma db push --schema=apps/api/prisma/schema.prisma

# Seed permissions, roles, and default users
npm run seed --workspace=apps/api
```

### 5. Launch Development Servers
```bash
# Run both Frontend & Backend concurrently
npm run dev
```

- **Public Website & ERP Frontend**: [http://localhost:5173](http://localhost:5173) (or `http://localhost:3000`)
- **Backend API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **API Health Check**: [http://localhost:4000/api/v1/health/liveness](http://localhost:4000/api/v1/health/liveness)

---

## 📖 Additional Documentation

For full setup procedures, Docker configuration, and production deployment instructions, please consult:
- **[SETUP.md](./SETUP.md)**: Detailed step-by-step installation, environment variables reference, and troubleshooting guide.
- **[walkthrough.md](file:///C:/Users/Er.%20SANDEEP%20GAUD/.gemini/antigravity/brain/80559d15-e56e-426e-9d83-210b66866df2/walkthrough.md)**: Complete Phase 0–30 architectural implementation report.
