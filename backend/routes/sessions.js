const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// get all public sessions
router.get('/', (req, res) => {
  const query = `SELECT * FROM sessions WHERE session_type = 'public' ORDER BY date, time`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ sessions: rows });
  });
});

// get single session by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `SELECT * FROM sessions WHERE id = ?`;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session: row });
  });
});

// create new session
router.post('/', (req, res) => {
  const { title, description, date, time, max_participants, session_type, location, creator_email } = req.body;
  
  // generate codes
  const management_code = uuidv4().substring(0, 8);
  const private_code = session_type === 'private' ? uuidv4().substring(0, 8) : null;
  
  const query = `
    INSERT INTO sessions (title, description, date, time, max_participants, session_type, location, management_code, private_code, creator_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [title, description, date, time, max_participants, session_type, location, management_code, private_code, creator_email], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // return the created session with codes
    res.status(201).json({
      message: 'Session created successfully',
      session_id: this.lastID,
      management_code: management_code,
      private_code: private_code
    });
  });
});

module.exports = router;