const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');
const { sendSessionCreatedEmail } = require('../services/emailService');

// get all public sessions with filters
router.get('/', (req, res) => {
  const { search, date, upcoming } = req.query;
  
  let query = `SELECT * FROM sessions WHERE session_type = 'public'`;
  const params = [];
  
  // search by keyword in title or description
  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  
  // filter by specific date
  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }
  
  // filter upcoming or past sessions
  if (upcoming === 'true') {
    query += ` AND date >= date('now')`;
  } else if (upcoming === 'false') {
    query += ` AND date < date('now')`;
  }
  
  query += ` ORDER BY date, time`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ sessions: rows, count: rows.length });
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

// create new session
router.post('/', async (req, res) => {
  const { title, description, date, time, max_participants, session_type, location, creator_email } = req.body;
  
  console.log('📝 Creating session...'); // DEBUG
  console.log('📧 Creator email:', creator_email); // DEBUG
  
  // generate codes
  const management_code = uuidv4().substring(0, 8);
  const private_code = session_type === 'private' ? uuidv4().substring(0, 8) : null;
  
  const query = `
    INSERT INTO sessions (title, description, date, time, max_participants, session_type, location, management_code, private_code, creator_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [title, description, date, time, max_participants, session_type, location, management_code, private_code, creator_email], async function(err) {
    if (err) {
      console.error('❌ Database error:', err); // DEBUG
      return res.status(500).json({ error: err.message });
    }
    
    console.log('✅ Session saved to database'); // DEBUG
    
    // send email if email provided
    if (creator_email && creator_email.trim()) {
      console.log('📤 Attempting to send email...'); // DEBUG
      try {
        await sendSessionCreatedEmail(creator_email, title, management_code, private_code);
        console.log(`✅ Email sent to ${creator_email}`);
      } catch (error) {
        console.error('❌ Failed to send email:', error);
      }
    } else {
      console.log('⚠️ No email provided, skipping email'); // DEBUG
    }
    
    // return the created session with codes
    res.status(201).json({
      message: 'Session created successfully',
      session_id: this.lastID,
      management_code: management_code,
      private_code: private_code,
      email_sent: creator_email ? true : false
    });
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