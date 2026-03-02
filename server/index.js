require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialise DB (runs schema creation)
require('./db');

const authRoutes       = require('./routes/auth');
const activitiesRoutes = require('./routes/activities');
const { requireAuth }  = require('./middleware/auth');
const { sendReminderEmail } = require('./email');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ─── Middleware ─────────────────────────────────────────────────────────── */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

/* ─── Routes ─────────────────────────────────────────────────────────────── */
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth',       authRoutes);
app.use('/api/activities', activitiesRoutes);

/* ─── Reminder scheduling ────────────────────────────────────────────────── */
// Map of activityId -> timeoutId
const scheduledReminders = new Map();

// POST /api/reminders/schedule
// Body: { activities: Activity[] }  (user resolved from JWT)
app.post('/api/reminders/schedule', requireAuth, (req, res) => {
  const { activities } = req.body;
  if (!Array.isArray(activities)) {
    return res.status(400).json({ error: 'activities array is required' });
  }

  const db   = require('./db');
  const user = db.prepare('SELECT email, full_name FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const today = new Date().toISOString().split('T')[0];
  const todayPending = activities.filter(a => a.date === today && !a.completed);
  let scheduled = 0;

  todayPending.forEach(activity => {
    const [h, m] = activity.startTime.split(':').map(Number);
    const activityTime  = new Date(); activityTime.setHours(h, m, 0, 0);
    const reminderTime  = new Date(activityTime.getTime() - 30 * 60 * 1000);
    const msUntil       = reminderTime.getTime() - Date.now();

    if (msUntil <= 0) return;

    // Cancel existing reminder for this activity
    if (scheduledReminders.has(activity.id)) {
      clearTimeout(scheduledReminders.get(activity.id));
    }

    const tid = setTimeout(() => {
      sendReminderEmail(user.email, user.full_name, activity).catch(() => {});
      scheduledReminders.delete(activity.id);
    }, msUntil);

    scheduledReminders.set(activity.id, tid);
    scheduled++;
    console.log(`📅 Reminder for "${activity.title}" in ${Math.round(msUntil / 60000)} min`);
  });

  res.json({ success: true, scheduled });
});

// DELETE /api/reminders/:activityId
app.delete('/api/reminders/:activityId', requireAuth, (req, res) => {
  const { activityId } = req.params;
  if (scheduledReminders.has(activityId)) {
    clearTimeout(scheduledReminders.get(activityId));
    scheduledReminders.delete(activityId);
  }
  res.json({ success: true });
});

/* ─── Global error handler ───────────────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ─── Start ──────────────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀 DoBetter API running on http://localhost:${PORT}`);
});
