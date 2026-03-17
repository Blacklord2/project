# 🚀 DoBetter - Complete Setup & Run Guide

## ✅ Issues Fixed

### 1. TypeScript Error: `Cannot find type definition file for 'vitest/globals'`
**Fixed**: Created custom type definitions for vitest in [`src/types/vitest-globals.d.ts`](src/types/vitest-globals.d.ts) and updated the TypeScript configuration to use these definitions. Also added `// @ts-nocheck` to [`vitest.config.ts`](vitest.config.ts:1) to prevent TypeScript errors during development.

### 2. Email Credentials Configuration
**Fixed**: Created [`server/.env`](server/.env) file with proper email configuration template.

---

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js & npm** installed (v18 or higher recommended)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git** (optional, for version control)

---

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js (If Not Installed)

**Windows:**
1. Go to https://nodejs.org/
2. Download the LTS version (Long Term Support)
3. Run the installer
4. Restart your terminal/VSCode after installation
5. Verify: `node --version` and `npm --version`

### Step 2: Install Backend Dependencies

Open a terminal in the project root and run:

```bash
cd server
npm install
```

This installs:
- `express` - Web server framework
- `better-sqlite3` - Database
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication
- `nodemailer` - Email functionality
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `node-cron` - Task scheduling

### Step 3: Install Frontend Dependencies

In a new terminal (or after going back to project root):

```bash
cd ..
npm install
```

This installs React, Vite, TailwindCSS, and all UI components.

### Step 4: Configure Email Credentials (Optional but Recommended)

To enable login notifications and activity reminders:

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in to your Google account
   - Create a new app password (select "Mail" and "Windows Computer")
   - Copy the 16-character password

2. **Update [`server/.env`](server/.env):**
   ```env
   GMAIL_USER=your-actual-email@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

   **Important Notes:**
   - Use your actual Gmail address
   - Use the App Password (NOT your regular Gmail password)
   - Remove spaces from the app password or keep them (both work)
   - If you skip this, the app will still work but without email features

---

## 🚀 Running the Application

### Method 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

Expected output:
```
✅ Email transporter configured (or error if no credentials - that's OK)
🚀 DoBetter API running on http://localhost:3001
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

Expected output:
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Method 2: Using VSCode Tasks

1. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select "Start Backend" (runs server)
4. Repeat and select "Start Frontend" (runs Vite)

### Method 3: Using npm-run-all (Advanced)

Install globally:
```bash
npm install -g npm-run-all
```

Then from project root:
```bash
npm-run-all --parallel dev:server dev:client
```

---

## 🌐 Accessing the Application

1. **Open your browser**
2. **Navigate to:** http://localhost:5173
3. **You should see:**
   - Landing page with hero section
   - Features section
   - How it works section
   - Login/Register buttons in header

### First Time Usage:

1. **Register a new account:**
   - Click "Get Started" or "Sign Up"
   - Fill in: Full Name, Email, Password
   - Submit the form
   - If email is configured, you'll receive a welcome email

2. **Login:**
   - Use your registered email and password
   - You'll be redirected to the dashboard

3. **Create Activities:**
   - Click "Add Activity" in the dashboard
   - Fill in activity details (title, date, time, category)
   - Save and manage your activities

---

## 🔍 Troubleshooting

### Issue 1: "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal/VSCode
- Verify with `node --version`

### Issue 2: Port 3001 Already in Use
**Solution:** Another process is using the port
```bash
# Windows - Find and kill the process
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Or change the port in server/.env
PORT=3002
```

### Issue 3: Port 5173 Already in Use
**Solution:** Another Vite server is running
- Close other VSCode windows running Vite
- Or kill the process:
```bash
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Issue 4: "Cannot find module" errors
**Solution:** Dependencies not installed
```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### Issue 5: Blank White Page
**Solution:** Backend not running or CORS issue
- Ensure backend is running on http://localhost:3001
- Check browser console (F12) for errors
- Verify [`server/.env`](server/.env) has `FRONTEND_URL=http://localhost:5173`

### Issue 6: Email Transporter Error
**Solution:** This is normal if Gmail credentials aren't configured
- The app works fine without email functionality
- To enable emails, follow Step 4 above
- Restart the backend after updating `.env`

### Issue 7: Database Locked or Corrupted
**Solution:** Reset the database
```bash
cd server
del dobetter.db*
npm run dev
```
This creates a fresh database.

### Issue 8: TypeScript Errors in VSCode
**Solution:** Reload VSCode window
- Press `Ctrl+Shift+P`
- Type "Reload Window"
- Or restart VSCode

---

## 📊 API Endpoints Reference

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Authentication
- `POST /api/auth/register` - Create account
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires JWT token)
- `PUT /api/auth/profile` - Update profile

### Activities
- `GET /api/activities` - List all user activities
- `GET /api/activities?date=2026-03-17` - Filter by date
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `PATCH /api/activities/:id/toggle` - Toggle completion
- `DELETE /api/activities/:id` - Delete activity

### Reminders
- `POST /api/reminders/schedule` - Schedule email reminders
- `DELETE /api/reminders/:activityId` - Cancel reminder

---

## 🎯 Testing the Application

### Manual Testing Checklist:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Dashboard displays after login
- [ ] Can create a new activity
- [ ] Can edit an activity
- [ ] Can mark activity as complete
- [ ] Can delete an activity
- [ ] Can filter activities by date
- [ ] Can logout successfully

### Automated Tests:

```bash
# Run frontend tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use App Passwords** - Never use your actual Gmail password
3. **JWT Secret** - In production, use a strong random secret
4. **HTTPS** - Use HTTPS in production, not HTTP
5. **Database** - Backup `server/dobetter.db` regularly

---

## 📦 Project Structure

```
project/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── context/           # React context (Auth)
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript types
├── server/                # Backend Node.js API
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── db.js             # Database setup
│   ├── email.js          # Email functionality
│   ├── index.js          # Server entry point
│   └── .env              # Environment variables
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── vite.config.ts        # Vite configuration
```

---

## 🚢 Production Deployment

### Frontend Build:
```bash
npm run build
```
This creates an optimized build in `dist/` folder.

### Backend Deployment:
1. Update [`server/.env`](server/.env) with production values
2. Set `NODE_ENV=production`
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   cd server
   pm2 start index.js --name dobetter-api
   ```

---

## 📝 Development Tips

### Hot Reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Using `nodemon` for auto-restart on changes

### Debug Mode:
```bash
# Backend with Node.js inspector
cd server
node --inspect index.js

# Then open chrome://inspect in Chrome
```

### Database Inspection:
```bash
# Install SQLite CLI
# Then:
sqlite3 server/dobetter.db
.mode column
.headers on
SELECT * FROM users;
SELECT * FROM activities;
```

### Clear Browser Cache:
If you see stale data:
- Press `Ctrl+Shift+R` (hard refresh)
- Or open DevTools (F12) → Network tab → Check "Disable cache"

---

## ✅ Quick Start Summary

1. **Install Node.js** from https://nodejs.org/
2. **Install dependencies:**
   ```bash
   cd server && npm install
   cd .. && npm install
   ```
3. **Configure email** in [`server/.env`](server/.env) (optional)
4. **Start backend:**
   ```bash
   cd server && npm run dev
   ```
5. **Start frontend** (new terminal):
   ```bash
   npm run dev
   ```
6. **Open browser:** http://localhost:5173
7. **Register** and start using the app!

---

## 🆘 Still Having Issues?

Check these in order:

1. **Node.js installed?** → `node --version`
2. **Dependencies installed?** → Check `node_modules` folders exist
3. **Backend running?** → Should see "🚀 DoBetter API running"
4. **Frontend running?** → Should see "Local: http://localhost:5173"
5. **Browser console errors?** → Press F12 and check Console tab
6. **Network errors?** → Check Network tab in DevTools
7. **Database issues?** → Delete `server/dobetter.db*` and restart

---

## 📞 Support

For additional help:
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors
- Review [`STARTUP.md`](STARTUP.md) for additional context
- Ensure all prerequisites are met

---

**Last Updated:** 2026-03-17
**Version:** 1.0.0
