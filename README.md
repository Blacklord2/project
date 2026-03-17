# DoBetter — Personal Activity Planner

DoBetter is a full-stack activity management app for organizing your day, tracking progress, and building better habits.

## Features

- **Activity CRUD** — Create, edit, delete, and toggle activities with title, description, date, time range, and category (work, study, fitness, personal, other)
- **Dashboard** — KPI cards (today's count, completed, pending, streak), weekly bar chart, category pie chart, and category breakdown with progress bars
- **ICS Import** — Upload `.ics` calendar files to bulk-import events. Categories are auto-mapped (e.g. "Meeting" → work, "Exercise" → fitness)
- **Email Reminders** — Server schedules email reminders 5 minutes before each activity's start time via Gmail SMTP
- **Authentication** — JWT-based registration, login, and session restore. Logged-in users are redirected away from auth pages
- **Responsive** — Mobile-friendly layout with collapsible navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | SQLite via sql.js (pure JS, no native deps) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| ICS Parsing | node-ical |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Environment Setup

Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default: 3001) |
| `FRONTEND_URL` | Frontend origin for CORS (default: http://localhost:5173) |
| `GMAIL_USER` | Gmail address for sending reminders |
| `GMAIL_APP_PASSWORD` | Gmail [app password](https://myaccount.google.com/apppasswords) (not your regular password) |

Email reminders are optional — the app works without Gmail credentials configured.

### Running

Start both servers simultaneously in separate terminals:

```bash
# Terminal 1 — Backend (from project root)
cd server
npm run dev

# Terminal 2 — Frontend (from project root)
npm run dev
```

Then open **http://localhost:5173**.

### Demo Account

| Field | Value |
|-------|-------|
| Email | `user@dobetter.com` |
| Password | `user123` |

A demo user is auto-seeded on first database initialization.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Activities (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | List all (optional `?date=YYYY-MM-DD`) |
| POST | `/api/activities` | Create activity |
| POST | `/api/activities/import` | Import from .ics file (multipart form) |
| PUT | `/api/activities/:id` | Update activity |
| PATCH | `/api/activities/:id/toggle` | Toggle completed |
| DELETE | `/api/activities/:id` | Delete activity |

### Reminders (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reminders/schedule` | Schedule email reminders for today's activities |
| DELETE | `/api/reminders/:activityId` | Cancel a scheduled reminder |

## ICS Import

Upload any standard `.ics` calendar file to bulk-import events. A test file is included at `test.ics`.

Category mapping:
- **work** — meeting, business, office, job
- **study** — class, school, education, learning
- **fitness** — exercise, gym, sport, workout, health
- **personal** — family, friends, social, home
- All-day events default to 09:00–17:00

## Testing

```bash
# Run tests (single run)
npm run test

# Watch mode
npm run test:watch
```

Uses Vitest with jsdom environment.

## Project Structure

```
├── src/
│   ├── pages/              # Route pages (Index, Login, Register, Dashboard)
│   ├── components/
│   │   ├── dashboard/      # UserDashboard (charts, activity list, KPIs)
│   │   ├── landing/        # Hero, Features, HowItWorks, CTA sections
│   │   ├── layout/         # Header, Footer, Layout wrapper
│   │   └── ui/             # shadcn/ui component library
│   ├── context/            # AuthContext (global auth state)
│   ├── lib/                # api.ts (centralized fetch client)
│   ├── hooks/              # use-toast, use-mobile
│   └── types/              # TypeScript interfaces
├── server/
│   ├── routes/             # auth.js, activities.js (with ICS import)
│   ├── middleware/         # JWT auth middleware
│   ├── db.js               # sql.js database wrapper
│   ├── email.js            # Nodemailer templates & send functions
│   └── index.js            # Express app, reminder scheduling
├── test.ics                # Sample ICS file for testing import
└── CLAUDE.md               # AI assistant instructions
```

## License

All rights reserved.
