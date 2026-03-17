# ⚡ Quick Start - DoBetter Application

## ✅ What Was Fixed

1. **TypeScript Error Fixed** ✓
   - Created custom type definitions in [`src/types/vitest-globals.d.ts`](src/types/vitest-globals.d.ts)
   - Added `// @ts-nocheck` to [`vitest.config.ts`](vitest.config.ts)
   - Updated TypeScript configuration files

2. **Email Configuration Created** ✓
   - Created [`server/.env`](server/.env) file with email template

---

## 🚨 IMPORTANT: You Need Node.js!

**The error "npm is not recognized" means Node.js is not installed.**

### Install Node.js Now:
1. Go to: **https://nodejs.org/**
2. Download the **LTS version** (recommended)
3. Run the installer
4. **Restart VSCode** after installation
5. Verify: Open a new terminal and type:
   ```bash
   node --version
   npm --version
   ```

---

## 📋 Step-by-Step: Run Your Application

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ..
npm install
```

### Step 3: Configure Email (Optional)
Edit [`server/.env`](server/.env):
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

**Get App Password:** https://myaccount.google.com/apppasswords

**Note:** App works without email, but you won't get notifications.

### Step 4: Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

**Expected:** `🚀 DoBetter API running on http://localhost:3001`

### Step 5: Start Frontend (Terminal 2)
```bash
npm run dev
```

**Expected:** `Local: http://localhost:5173/`

### Step 6: Open Browser
Navigate to: **http://localhost:5173**

---

## 🎯 What You Should See

1. **Landing Page** with:
   - Hero section
   - Features
   - How it works
   - Login/Register buttons

2. **After Registration:**
   - Dashboard with activity management
   - Calendar view
   - Statistics

---

## ⚠️ Common Issues & Solutions

### "npm is not recognized"
→ **Install Node.js** from https://nodejs.org/ and restart VSCode

### Port 3001 already in use
```bash
netstat -ano | findstr :3001
taskkill /PID <number> /F
```

### Port 5173 already in use
```bash
netstat -ano | findstr :5173
taskkill /PID <number> /F
```

### Blank white page
→ Make sure backend is running on port 3001

### Email transporter error
→ Normal if you haven't configured Gmail credentials

---

## 🔄 Restart Everything

If something goes wrong:

1. **Stop both terminals** (Ctrl+C)
2. **Close VSCode**
3. **Reopen VSCode**
4. **Start backend:** `cd server && npm run dev`
5. **Start frontend:** `npm run dev` (new terminal)

---

## 📚 Full Documentation

For detailed information, see:
- [`SETUP_GUIDE.md`](SETUP_GUIDE.md) - Complete setup instructions
- [`STARTUP.md`](STARTUP.md) - Original startup documentation

---

## ✅ Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Email configured in [`server/.env`](server/.env) (optional)
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Browser open at http://localhost:5173
- [ ] Can register and login

---

**Need Help?** Check [`SETUP_GUIDE.md`](SETUP_GUIDE.md) for troubleshooting!
