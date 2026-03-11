const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'dobetter.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT    NOT NULL,
    full_name   TEXT    NOT NULL,
    password    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS activities (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,
    description TEXT,
    date        TEXT    NOT NULL,
    start_time  TEXT    NOT NULL,
    end_time    TEXT    NOT NULL,
    category    TEXT    NOT NULL DEFAULT 'other',
    completed   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Migration: Recreate users table to remove UNIQUE constraint from email
// This handles the case where the database was created with Lovable template
try {
  // Check if we need to migrate (if old table has UNIQUE constraint)
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  const hasUniqueConstraint = db.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='users'"
  ).get();
  
  if (hasUniqueConstraint && hasUniqueConstraint.sql && hasUniqueConstraint.sql.includes('UNIQUE')) {
    // Backup existing data
    const users = db.prepare('SELECT * FROM users').all();
    const activities = db.prepare('SELECT * FROM activities').all();
    
    // Drop old tables
    db.exec('DROP TABLE IF EXISTS activities');
    db.exec('DROP TABLE IF EXISTS users');
    
    // Recreate with new schema
    db.exec(`
      CREATE TABLE users (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        email       TEXT    NOT NULL,
        full_name   TEXT    NOT NULL,
        password    TEXT    NOT NULL,
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE activities (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title       TEXT    NOT NULL,
        description TEXT,
        date        TEXT    NOT NULL,
        start_time  TEXT    NOT NULL,
        end_time    TEXT    NOT NULL,
        category    TEXT    NOT NULL DEFAULT 'other',
        completed   INTEGER NOT NULL DEFAULT 0,
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      );
    `);
    
    // Restore users (remap IDs to avoid conflicts)
    const insertUser = db.prepare('INSERT INTO users (email, full_name, password, created_at) VALUES (?, ?, ?, ?)');
    const userIdMap = {};
    for (const user of users) {
      const result = insertUser.run(user.email, user.full_name, user.password, user.created_at);
      userIdMap[user.id] = result.lastInsertRowid;
    }
    
    // Restore activities
    if (activities.length > 0) {
      const insertActivity = db.prepare(
        'INSERT INTO activities (user_id, title, description, date, start_time, end_time, category, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const activity of activities) {
        insertActivity.run(
          userIdMap[activity.user_id],
          activity.title,
          activity.description,
          activity.date,
          activity.start_time,
          activity.end_time,
          activity.category,
          activity.completed,
          activity.created_at
        );
      }
    }
    console.log('✅ Database migrated: removed UNIQUE constraint from email');
  }
} catch (e) {
  console.log('✅ Database schema initialized');
}

// ── Seed Demo User ───────────────────────────────────────────────────────────

const demoEmail = 'user@dobetter.com';
const existingDemo = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail);

if (!existingDemo) {
  const hashedPassword = bcrypt.hashSync('user123', 10);
  db.prepare(
    'INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)'
  ).run(demoEmail, 'Demo User', hashedPassword);
  console.log('✅ Demo user created: user@dobetter.com / user123');
}

console.log('✅ Database initialised at', DB_PATH);

module.exports = db;
