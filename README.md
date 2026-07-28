# SientoOps Platform & Academy - Enterprise SaaS Platform

Modern, scalable, multi-subdomain SaaS educational and cloud infrastructure platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Clean Architecture (Repository-Service-Hook-UI Pattern)**.

---

## 🌐 Multi-Subdomain Architecture

The platform operates across isolated subdomain applications without exposing path prefixes (`/academy` or `/admin`) in the browser URL bar:

| Environment | Application | Browser Local Address | Production Address |
| :--- | :--- | :--- | :--- |
| **Marketing Site** | Landing, Features, Pricing, Auth | `http://localhost:3000` | `https://sientoops.com` |
| **User Academy** | Dashboard, Courses, Workshops, Documents, Profile | `http://academy.localhost:3000` | `https://academy.sientoops.com` |
| **Admin Panel** | Analytics, User Management, Content Management | `http://admin.localhost:3000` | `https://admin.sientoops.com` |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher

### 2. Installation & Running
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Accessing Subdomains Locally
Modern web browsers (Chrome, Edge, Firefox, Safari) natively resolve `*.localhost` subdomains to `127.0.0.1` automatically. **No `/etc/hosts` changes are required!**

Open your browser and navigate directly to:
- **Marketing Site**: [http://localhost:3000](http://localhost:3000)
- **User Academy Application**: [http://academy.localhost:3000/dashboard](http://academy.localhost:3000/dashboard)
- **Admin Panel Application**: [http://admin.localhost:3000/dashboard](http://admin.localhost:3000/dashboard)

---

## 🏗️ Architecture & Technical Rules

### 1. Clean Subdomain Routing (`src/middleware.ts`)
Next.js Middleware inspects the HTTP `Host` header (`admin.localhost`, `academy.localhost`, `localhost`) and internally rewrites requests to internal route groups (`/(subdomains)/admin`, `/(subdomains)/academy`, `/(subdomains)/marketing`) while keeping the browser URL bar clean:
- `http://academy.localhost:3000/dashboard` $\rightarrow$ Displays `/dashboard`
- `http://admin.localhost:3000/dashboard` $\rightarrow$ Displays `/dashboard`

### 2. Backend Single Source of Truth
- Admin and User applications are frontend-isolated.
- Content added in the Admin Panel sends `POST /api/v1/courses` to the Laravel 12 API -> stored in PostgreSQL -> User Panel queries `GET /api/v1/courses`.
- Zero local event emitters or shared fake frontend state.

### 3. Repository Adapter Pattern (Laravel 12 Preparedness)
- All data access is governed by strict TypeScript interfaces (`ICourseRepository`, `IWorkshopRepository`, etc.).
- Currently powered by `MockRepository` adapters. Transitioning to Laravel 12 API in Sprint 9 requires changing **only 1 line of configuration** in `src/repositories/index.ts`.

---

## 🛠️ Verification & Build Commands

```bash
# TypeScript Type Check
npx tsc --noEmit

# Production Build Test
npm run build
```
