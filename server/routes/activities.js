const express = require('express');
const multer = require('multer');
const ical = require('node-ical');
const { getDb } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All activity routes require authentication
router.use(requireAuth);

// Multer setup for .ics file uploads (in-memory, 5MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/calendar' || file.originalname.endsWith('.ics')) {
      cb(null, true);
    } else {
      cb(new Error('Only .ics files are allowed'));
    }
  },
});

// Helper: map ICS category to app category
function mapIcsCategory(categories) {
  const valid = ['work', 'study', 'fitness', 'personal'];
  if (!categories) return 'other';
  const cats = Array.isArray(categories) ? categories : [categories];
  for (const c of cats) {
    const lower = String(c).toLowerCase().trim();
    if (valid.includes(lower)) return lower;
    if (['job', 'office', 'meeting', 'business'].includes(lower)) return 'work';
    if (['education', 'learning', 'school', 'class'].includes(lower)) return 'study';
    if (['exercise', 'gym', 'sport', 'health', 'workout'].includes(lower)) return 'fitness';
    if (['family', 'friends', 'social', 'home'].includes(lower)) return 'personal';
  }
  return 'other';
}

// Helper: extract local date and time from a Date object
function extractDateTime(dt) {
  if (!dt) return null;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return null;
  return {
    date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  };
}

// Helper: map DB row to API shape
function mapActivity(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description || '',
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    category: row.category,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

// ── GET /api/activities ───────────────────────────────────────────────────────
// Query params: ?date=YYYY-MM-DD (optional filter)
router.get('/', (req, res) => {
  const { date } = req.query;
  let rows;
  if (date) {
    rows = getDb().prepare(
      'SELECT * FROM activities WHERE user_id = ? AND date = ? ORDER BY start_time ASC'
    ).all(req.user.id, date);
  } else {
    rows = getDb().prepare(
      'SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC, start_time ASC'
    ).all(req.user.id);
  }
  res.json(rows.map(mapActivity));
});

// ── POST /api/activities ──────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const { title, description, date, startTime, endTime, category } = req.body;

  if (!title || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'title, date, startTime, and endTime are required' });
  }

  const validCategories = ['work', 'study', 'fitness', 'personal', 'other'];
  const cat = validCategories.includes(category) ? category : 'other';

  const result = getDb().prepare(`
    INSERT INTO activities (user_id, title, description, date, start_time, end_time, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title, description || '', date, startTime, endTime, cat);

  const row = getDb().prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(mapActivity(row));
});

// ── PUT /api/activities/:id ───────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const existing = getDb().prepare(
    'SELECT * FROM activities WHERE id = ? AND user_id = ?'
  ).get(id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const { title, description, date, startTime, endTime, category, completed } = req.body;
  const validCategories = ['work', 'study', 'fitness', 'personal', 'other'];

  getDb().prepare(`
    UPDATE activities SET
      title       = ?,
      description = ?,
      date        = ?,
      start_time  = ?,
      end_time    = ?,
      category    = ?,
      completed   = ?
    WHERE id = ? AND user_id = ?
  `).run(
    title       ?? existing.title,
    description ?? existing.description,
    date        ?? existing.date,
    startTime   ?? existing.start_time,
    endTime     ?? existing.end_time,
    validCategories.includes(category) ? category : existing.category,
    completed !== undefined ? (completed ? 1 : 0) : existing.completed,
    id,
    req.user.id,
  );

  const row = getDb().prepare('SELECT * FROM activities WHERE id = ?').get(id);
  res.json(mapActivity(row));
});

// ── PATCH /api/activities/:id/toggle ─────────────────────────────────────────
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const existing = getDb().prepare(
    'SELECT * FROM activities WHERE id = ? AND user_id = ?'
  ).get(id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const newCompleted = existing.completed === 1 ? 0 : 1;
  getDb().prepare('UPDATE activities SET completed = ? WHERE id = ?').run(newCompleted, id);

  const row = getDb().prepare('SELECT * FROM activities WHERE id = ?').get(id);
  res.json(mapActivity(row));
});

// ── DELETE /api/activities/:id ────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const existing = getDb().prepare(
    'SELECT id FROM activities WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  getDb().prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── POST /api/activities/import ────────────────────────────────────────────
router.post('/import', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No .ics file provided' });
  }

  let parsed;
  try {
    parsed = ical.parseICS(req.file.buffer.toString('utf-8'));
  } catch (e) {
    return res.status(400).json({ error: 'Failed to parse .ics file' });
  }

  const events = Object.values(parsed).filter(e => e.type === 'VEVENT');
  if (events.length === 0) {
    return res.status(400).json({ error: 'No events found in the .ics file' });
  }

  const db = getDb();
  const imported = [];
  let skipped = 0;

  for (const event of events) {
    const start = extractDateTime(event.start);
    if (!start) { skipped++; continue; }

    let end = extractDateTime(event.end);
    if (!end) {
      // Default to 1 hour after start
      const endDate = new Date(event.start);
      endDate.setHours(endDate.getHours() + 1);
      end = extractDateTime(endDate);
    }

    // All-day events: if both times are 00:00, use sensible defaults
    if (start.time === '00:00' && end.time === '00:00') {
      start.time = '09:00';
      end.time = '17:00';
    }

    const title = event.summary || 'Untitled Event';
    const description = event.description || '';
    const category = mapIcsCategory(event.categories);

    try {
      const result = db.prepare(
        'INSERT INTO activities (user_id, title, description, date, start_time, end_time, category) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(req.user.id, title, description, start.date, start.time, end.time, category);

      const row = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
      if (row) imported.push(mapActivity(row));
    } catch (e) {
      skipped++;
    }
  }

  res.status(201).json({ success: true, imported: imported.length, skipped, activities: imported });
});

module.exports = router;
