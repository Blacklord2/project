# 🎯 DoBetter - Exact Commands to Run

## ⚠️ FIRST: Install Node.js

If you see "npm is not recognized", you need Node.js:

1. Visit: https://nodejs.org/
2. Download LTS version
3. Install it
4. **RESTART VSCODE**
5. Test: `node --version`

---

## 📝 Copy & Paste These Commands

### 1️⃣ Install Backend Dependencies

Open Terminal 1 in VSCode:

```bash
cd server
npm install
```

Wait for it to complete (may take 1-2 minutes).

---

### 2️⃣ Install Frontend Dependencies

In the same terminal or a new one:

```bash
cd ..
npm install
```

Wait for it to complete (may take 2-3 minutes).

---

### 3️⃣ Configure Email (OPTIONAL)

**Option A: Skip Email (App Still Works)**
- Do nothing, proceed to step 4

**Option B: Enable Email Notifications**

1. Get Gmail App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Create app password
   - Copy the 16-character code

2. Edit `server/.env` file:
   ```env
   GMAIL_USER=your-actual-email@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

---

### 4️⃣ Start Backend Server

**Terminal 1:**

```bash
cd server
npm run dev
```

**Expected Output:**
```
✅ Email transporter configured
🚀 DoBetter API running on http://localhost:3001
```

**Leave this terminal running!**

---

### 5️⃣ Start Frontend Server

**Terminal 2 (New Terminal):**

```bash
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Leave this terminal running too!**

---

### 6️⃣ Open in Browser

Click this link or copy to browser:

**http://localhost:5173**

---

## ✅ Success Indicators

You should see:

**Terminal 1 (Backend):**
```
🚀 DoBetter API running on http://localhost:3001
```

**Terminal 2 (Frontend):**
```
➜  Local:   http://localhost:5173/
```

**Browser:**
- Landing page with hero image
- "Get Started" button
- Login/Register options

---

## 🎮 Using the Application

### First Time:

1. **Register:**
   - Click "Get Started" or "Sign Up"
   - Enter: Full Name, Email, Password
   - Click "Create Account"

2. **Login:**
   - Enter your email and password
   - Click "Sign In"

3. **Dashboard:**
   - Click "Add Activity"
   - Fill in activity details
   - Save and manage activities

---

## 🔧 Troubleshooting Commands

### Check if Node.js is installed:
```bash
node --version
npm --version
```

### Kill process on port 3001:
```bash
netstat -ano | findstr :3001
taskkill /PID <number> /F
```

### Kill process on port 5173:
```bash
netstat -ano | findstr :5173
taskkill /PID <number> /F
```

### Reset database:
```bash
cd server
del dobetter.db*
npm run dev
```

### Reinstall dependencies:
```bash
# Backend
cd server
rmdir /s /q node_modules
npm install

# Frontend
cd ..
rmdir /s /q node_modules
npm install
```

---

## 🚨 Common Errors & Fixes

### Error: "npm is not recognized"
**Fix:** Install Node.js from https://nodejs.org/ and restart VSCode

### Error: "Port 3001 already in use"
**Fix:** Kill the process using the port (see troubleshooting commands above)

### Error: "Cannot find module"
**Fix:** Run `npm install` in the correct directory

### Error: Blank white page
**Fix:** 
1. Check backend is running (Terminal 1)
2. Check browser console (F12) for errors
3. Try hard refresh (Ctrl+Shift+R)

### Error: "Email transporter error"
**Fix:** This is normal if you haven't configured Gmail. App still works!

---

## 📊 Quick Reference

| What | Where | Command |
|------|-------|---------|
| Backend | Terminal 1 | `cd server && npm run dev` |
| Frontend | Terminal 2 | `npm run dev` |
| Backend URL | Browser | http://localhost:3001 |
| Frontend URL | Browser | http://localhost:5173 |
| Stop Server | Terminal | `Ctrl+C` |

---

## 🔄 Daily Workflow

Every time you want to run the app:

1. Open VSCode
2. Open Terminal 1: `cd server && npm run dev`
3. Open Terminal 2: `npm run dev`
4. Open browser: http://localhost:5173
5. Start working!

To stop:
1. Press `Ctrl+C` in Terminal 1
2. Press `Ctrl+C` in Terminal 2
3. Close browser tab

---

## 📚 More Help

- **Full Setup Guide:** [`SETUP_GUIDE.md`](SETUP_GUIDE.md)
- **Quick Start:** [`QUICK_START.md`](QUICK_START.md)
- **Original Docs:** [`STARTUP.md`](STARTUP.md)

---

**Ready to start? Follow the commands above in order! 🚀**
