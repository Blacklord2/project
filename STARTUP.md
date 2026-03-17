 # 🚀 DoBetter - Startup Guide

### 1. **Blank White Page** 
**Problem**: The `App.css` file had restrictive CSS styles that were conflicting with Tailwind CSS layout.
- Removed `max-width: 1280px`, `margin: 0 auto`, and `padding: 2rem` from `#root`
- This was causing the page content to be hidden or improperly styled

**Solution**: Updated `App.css` to only define `min-height: 100vh` for the root element, allowing Tailwind CSS to handle all layout.

### 2. **Backend Missing Environment Configuration** 
**Problem**: Server had no `.env` file with required configuration.

**Solution**: Created `server/.env` with:
- Server port: `3001`
- Frontend URL for CORS: `http://localhost:5173` 
- Email configuration placeholders (optional)

---

## Quick Start

### Terminal 1:
```bash
cd server
npm install          # Install dependencies if not already done
npm run dev          # Start with nodemon (auto-reload on changes)
```

Expected output:
```
Email transporter error: (this is OK if no Gmail credentials)
🚀 DoBetter API running on http://localhost:3001
```

### Terminal 2: Start the Frontend
```bash
npm install          # Install dependencies if not already done
npm run dev          # Start Vite dev server
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Press h + enter to show help
```

### Access the Application
Open your browser and navigate to: **http://localhost:5173**

You should now see the DoBetter landing page with:
- Hero section with background image
- Features section
- How it works section
- CTA section
- Fully functional header and footer

---

## Feature Status

### ✅ Working
- Frontend renders without blank page
- Backend API server runs on port 3001
- CORS configured for frontend
- Authentication routes (login, register, profile)
- Activity CRUD operations
- Database schema and migrations
- Email reminders (requires Gmail configuration)

### ⚠️ Optional Setup
**Email Notifications**: To enable login & reminder emails:
1. Get a Gmail App Password from: https://myaccount.google.com/apppasswords
2. Update `server/.env`:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   ```
3. Restart the backend

---

## API Endpoints

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update profile

### Activities
- `GET /api/activities` - List all activities
- `GET /api/activities?date=YYYY-MM-DD` - Filter by date
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `PATCH /api/activities/:id/toggle` - Toggle completion
- `DELETE /api/activities/:id` - Delete activity

### Reminders
- `POST /api/reminders/schedule` - Schedule reminders
- `DELETE /api/reminders/:activityId` - Cancel reminder

---

## Troubleshooting

### Port Already in Use
If you see "Port 3001 already in use":
```bash
# Windows - Find and kill the process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Issues
Database is stored in `server/dobetter.db`. If you want to reset:
```bash
cd server
rm dobetter.db*    # Remove database files
npm run dev        # Restart - fresh database will be created
```

### Frontend Not Connecting to Backend
Make sure:
1. Backend is running on `http://localhost:3001`
2. Frontend is on `http://localhost:5173`
3. No browser extensions blocking requests
4. Check browser console for API errors

### Email Transporter Error
This is normal if Gmail credentials aren't configured. The app will run fine without email functionality.

---

## Development Tips

### Hot Reload
- **Frontend**: Vite automatically reloads on code changes
- **Backend**: Nodemon configured in `npm run dev` for auto-reload

### Debug Mode
```bash
# Terminal 1 - Backend with debugging
cd server && node --inspect index.js

# Terminal 2 - Open Chrome DevTools
chrome://inspect
```

### Database Inspection
```bash
# Install sqlite3 CLI
# Then inspect database:
sqlite3 server/dobetter.db ".mode column" "SELECT * FROM users;"
```

---

## Production Build

### Frontend
```bash
npm run build      # Creates optimized build in dist/
npm run preview    # Test production build locally
```

### Backend
Change `server/.env`:
```
PORT=3001
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

Then deploy the `server/` directory with:
```bash
npm ci              # Clean install
npm run start       # Start server
```

---

## Support

For issues or questions, check:
- Browser console for frontend errors
- Terminal output for backend errors
- `.env` file configuration
- Database integrity with SQLite
