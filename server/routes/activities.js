const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All activity routes require authentication
router.use(requireAuth);

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
    rows = db.prepare(
      'SELECT * FROM activities WHERE user_id = ? AND date = ? ORDER BY start_time ASC'
    ).all(req.user.id, date);
  } else {
    rows = db.prepare(
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

  const result = db.prepare(`
    INSERT INTO activities (user_id, title, description, date, start_time, end_time, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title, description || '', date, startTime, endTime, cat);

  const row = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(mapActivity(row));
});

// ── PUT /api/activities/:id ───────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare(
    'SELECT * FROM activities WHERE id = ? AND user_id = ?'
  ).get(id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const { title, description, date, startTime, endTime, category, completed } = req.body;
  const validCategories = ['work', 'study', 'fitness', 'personal', 'other'];

  db.prepare(`
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

  const row = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
  res.json(mapActivity(row));
});

// ── PATCH /api/activities/:id/toggle ─────────────────────────────────────────
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare(
    'SELECT * FROM activities WHERE id = ? AND user_id = ?'
  ).get(id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const newCompleted = existing.completed === 1 ? 0 : 1;
  db.prepare('UPDATE activities SET completed = ? WHERE id = ?').run(newCompleted, id);

  const row = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
  res.json(mapActivity(row));
});

// ── DELETE /api/activities/:id ────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const existing = db.prepare(
    'SELECT id FROM activities WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
