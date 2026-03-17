# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DoBetter is a full-stack personal activity management app. React/TypeScript frontend (Vite) with an Express.js/SQLite backend.

## Commands

### Frontend (project root)
```bash
npm install          # Install dependencies
npm run dev          # Dev server on port 5173
npm run build        # Production build to dist/
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch mode
```

### Backend (server/ directory)
```bash
cd server
npm install          # Install dependencies
npm run dev          # Dev server with nodemon on port 3001
npm start            # Production server
```

Both servers must run simultaneously. The Vite config proxies `/api` requests to the backend.

## Architecture

### Frontend (`src/`)
- **Routing:** React Router v6 — pages in `src/pages/` (Index, Login, Register, Dashboard, NotFound)
- **Auth state:** React Context (`src/context/AuthContext.tsx`) provides user/token globally
- **Server state:** React Query for activity data fetching/caching
- **API client:** `src/lib/api.ts` — centralized fetch wrapper with automatic Bearer token injection
- **UI components:** shadcn-ui in `src/components/ui/`, feature components grouped by domain (`dashboard/`, `landing/`, `layout/`)
- **Path alias:** `@/*` maps to `src/*`

### Backend (`server/`)
- **Entry:** `server/index.js` — Express app on port 3001
- **Database:** `server/db.js` — SQLite via sql.js (pure JS, no native compilation), two tables: `users` and `activities`
- **Auth:** JWT middleware in `server/middleware/auth.js`; passwords hashed with bcryptjs
- **Routes:** `server/routes/auth.js` (register/login/profile) and `server/routes/activities.js` (CRUD)
- **Email:** `server/email.js` — Nodemailer for activity reminders
- **Data convention:** snake_case in DB columns, camelCase in API responses (mapped via `mapActivity` helper)

### Key Data Flow
1. Frontend calls `api.ts` functions → fetch to `/api/*`
2. Vite proxy forwards to Express on port 3001
3. Auth middleware validates JWT on protected routes
4. Routes query SQLite and return JSON

## Environment Setup

Backend requires a `.env` file in `server/` — see `server/.env.example` for required variables (JWT secret, email config).

Demo credentials: `user@dobetter.com` / `user123`

## Testing

Tests use Vitest with jsdom environment and global test functions (no imports needed for `describe`, `it`, `expect`). Config in `vitest.config.ts`.
