# DoBetter - Personal Activity Planner

## Project Overview

DoBetter is a personal activity management application designed to help students, professionals, and anyone who wants to organize their daily life. Plan your day, track your progress, and build better habits — all in one place.

## Features

- **Activity Management**: Create, organize, and track your daily activities
- **User Authentication**: Secure registration and login system
- **Dashboard**: View and manage your activities
- **Categories**: Organize activities by category
- **Progress Tracking**: Mark activities as completed

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT tokens

## Getting Started

### Prerequisites

- Node.js & npm installed
- XAMPP (for PHP-based servers, optional)

### Installation

```sh
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Start the development server
npm run dev
```

### Demo Credentials

- **Email**: user@dobetter.com
- **Password**: user123

## Project Structure

```
DoBetter2.0/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   ├── context/            # React context (auth)
│   ├── lib/                # Utility functions
│   └── assets/             # Static assets
├── server/                 # Backend server
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── db.js               # Database configuration
└── public/                 # Public assets
```

## License

All rights reserved.
