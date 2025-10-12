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

// get private session by private code
router.get('/private/:code', (req, res) => {
  const { code } = req.params;
  
  const query = `SELECT * FROM sessions WHERE private_code = ?`;
  
  db.get(query, [code], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Private session not found' });
    }
    res.json({ session: row });
  });
});

// update session with management code
router.put('/:id/manage', (req, res) => {
  const { id } = req.params;
  const { code } = req.query;
  const { title, description, date, time, max_participants, location } = req.body;
  
  // check if management code is correct
  db.get('SELECT * FROM sessions WHERE id = ? AND management_code = ?', [id, code], (err, session) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!session) {
      return res.status(403).json({ error: 'Invalid management code or session not found' });
    }
    
    // update the session
    const query = `
      UPDATE sessions 
      SET title = ?, description = ?, date = ?, time = ?, max_participants = ?, location = ?
      WHERE id = ?
    `;
    
    db.run(query, [title, description, date, time, max_participants, location, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Session updated successfully' });
    });
  });
});

// delete session with management code
router.delete('/:id/manage', (req, res) => {
  const { id } = req.params;
  const { code } = req.query;
  
  // verify management code first
  db.get('SELECT * FROM sessions WHERE id = ? AND management_code = ?', [id, code], (err, session) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!session) {
      return res.status(403).json({ error: 'Invalid management code or session not found' });
    }
    
    // delete the session
    db.run('DELETE FROM sessions WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Session deleted successfully' });
    });
  });
});

module.exports = router;