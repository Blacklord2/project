const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'dobetter.db');

let db;

async function initDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database file if it exists, otherwise create new
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // ── Schema ────────────────────────────────────────────────────────────────────

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      email       TEXT    NOT NULL,
      full_name   TEXT    NOT NULL,
      password    TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
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
    )
  `);

  // Migration: Recreate users table to remove UNIQUE constraint from email
  try {
    const schemaRow = db.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'");
    if (schemaRow.length > 0 && schemaRow[0].values[0][0] && schemaRow[0].values[0][0].includes('UNIQUE')) {
      // Backup existing data
      const users = db.exec('SELECT * FROM users');
      const activities = db.exec('SELECT * FROM activities');

      // Drop old tables
      db.run('DROP TABLE IF EXISTS activities');
      db.run('DROP TABLE IF EXISTS users');

      // Recreate with new schema
      db.run(`
        CREATE TABLE users (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          email       TEXT    NOT NULL,
          full_name   TEXT    NOT NULL,
          password    TEXT    NOT NULL,
          created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        )
      `);

      db.run(`
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
        )
      `);

      // Restore users
      if (users.length > 0) {
        const userCols = users[0].columns;
        const userIdMap = {};
        for (const row of users[0].values) {
          const userData = {};
          userCols.forEach((col, i) => { userData[col] = row[i]; });
          db.run('INSERT INTO users (email, full_name, password, created_at) VALUES (?, ?, ?, ?)',
            [userData.email, userData.full_name, userData.password, userData.created_at]);
          const newId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
          userIdMap[userData.id] = newId;
        }

        // Restore activities
        if (activities.length > 0) {
          const actCols = activities[0].columns;
          for (const row of activities[0].values) {
            const actData = {};
            actCols.forEach((col, i) => { actData[col] = row[i]; });
            db.run(
              'INSERT INTO activities (user_id, title, description, date, start_time, end_time, category, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [userIdMap[actData.user_id], actData.title, actData.description, actData.date,
               actData.start_time, actData.end_time, actData.category, actData.completed, actData.created_at]
            );
          }
        }
      }
      console.log('✅ Database migrated: removed UNIQUE constraint from email');
    }
  } catch (e) {
    console.log('✅ Database schema initialized');
  }

  // ── Seed Demo User ───────────────────────────────────────────────────────────

  const existingDemo = db.exec("SELECT id FROM users WHERE email = 'user@dobetter.com'");
  if (existingDemo.length === 0 || existingDemo[0].values.length === 0) {
    const hashedPassword = bcrypt.hashSync('user123', 10);
    db.run('INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)',
      ['user@dobetter.com', 'Demo User', hashedPassword]);
    console.log('✅ Demo user created: user@dobetter.com / user123');
  }

  // Save to disk
  saveDb();

  console.log('✅ Database initialised at', DB_PATH);
  return db;
}

// ── Helper functions wrapping sql.js API to match better-sqlite3 style ────────

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Wrapper that provides a better-sqlite3-compatible interface
function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');

  return {
    prepare(sql) {
      return {
        run(...params) {
          db.run(sql, params);
          const lastId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
          const changes = db.getRowsModified();
          saveDb();
          return { lastInsertRowid: lastId, changes };
        },
        get(...params) {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return row;
          }
          stmt.free();
          return undefined;
        },
        all(...params) {
          const result = db.exec(sql, params);
          if (result.length === 0) return [];
          const columns = result[0].columns;
          return result[0].values.map(row => {
            const obj = {};
            columns.forEach((col, i) => { obj[col] = row[i]; });
            return obj;
          });
        },
      };
    },
    exec(sql) {
      db.run(sql);
      saveDb();
    },
    pragma(pragma) {
      db.run(`PRAGMA ${pragma}`);
    },
  };
}

module.exports = { initDb, getDb };
