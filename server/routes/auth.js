const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, signToken } = require('../middleware/auth');
const { sendLoginEmail } = require('../email');

const router = express.Router();

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, fullName, password } = req.body;

  if (!email || !fullName || !password) {
    return res.status(400).json({ error: 'email, fullName, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)'
  ).run(email, fullName, hashed);

  const user = { id: result.lastInsertRowid, email, fullName };
  const token = signToken({ id: user.id, email, full_name: fullName });

  res.status(201).json({ user, token });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, row.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = { id: row.id, email: row.email, fullName: row.full_name };
  const token = signToken({ id: row.id, email: row.email, full_name: row.full_name });

  // Send login notification email (non-blocking)
  sendLoginEmail(user.email, user.fullName).catch(() => {});

  res.json({ user, token });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT id, email, full_name, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    createdAt: row.created_at,
  });
});

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
router.put('/profile', requireAuth, async (req, res) => {
  const { fullName, password } = req.body;
  const updates = [];
  const params = [];

  if (fullName) {
    updates.push('full_name = ?');
    params.push(fullName);
  }
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    updates.push('password = ?');
    params.push(await bcrypt.hash(password, 10));
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  params.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const row = db.prepare('SELECT id, email, full_name FROM users WHERE id = ?').get(req.user.id);
  res.json({ id: row.id, email: row.email, fullName: row.full_name });
});

module.exports = router;
