const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// create database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// create tables if they don't exist
db.serialize(() => {
  // sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      max_participants INTEGER NOT NULL,
      session_type TEXT NOT NULL,
      location TEXT,
      management_code TEXT UNIQUE NOT NULL,
      private_code TEXT UNIQUE,
      creator_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // attendance table
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      participant_name TEXT NOT NULL,
      attendance_code TEXT UNIQUE NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables ready');
});

module.exports = db;