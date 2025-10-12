const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// get all attendees for a session
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  const query = `SELECT * FROM attendance WHERE session_id = ? ORDER BY joined_at DESC`;
  
  db.all(query, [sessionId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ attendees: rows, count: rows.length });
  });
});

// join a session (mark as attending)
router.post('/join', (req, res) => {
  const { session_id, participant_name } = req.body;
  
  // check if session exists
  db.get('SELECT * FROM sessions WHERE id = ?', [session_id], (err, session) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // check current attendance count
    db.get('SELECT COUNT(*) as count FROM attendance WHERE session_id = ?', [session_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // check if session is full
      if (result.count >= session.max_participants) {
        return res.status(400).json({ error: 'Session is full' });
      }
      
      // generate unique attendance code
      const attendance_code = uuidv4().substring(0, 8);
      
      // add attendance
      const query = `
        INSERT INTO attendance (session_id, participant_name, attendance_code)
        VALUES (?, ?, ?)
      `;
      
      db.run(query, [session_id, participant_name, attendance_code], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.status(201).json({
          message: 'Successfully joined the session',
          attendance_code: attendance_code,
          attendance_id: this.lastID
        });
      });
    });
  });
});

// leave session using attendance code
router.delete('/leave', (req, res) => {
  const { attendance_code } = req.body;
  
  // find and delete attendance
  db.get('SELECT * FROM attendance WHERE attendance_code = ?', [attendance_code], (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!attendance) {
      return res.status(404).json({ error: 'Invalid attendance code' });
    }
    
    db.run('DELETE FROM attendance WHERE attendance_code = ?', [attendance_code], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Successfully left the session' });
    });
  });
});

// remove attendee by creator (using management code)
router.delete('/remove/:attendanceId', (req, res) => {
  const { attendanceId } = req.params;
  const { management_code } = req.body;
  
  // get attendance info
  db.get('SELECT * FROM attendance WHERE id = ?', [attendanceId], (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance not found' });
    }
    
    // verify management code
    db.get('SELECT * FROM sessions WHERE id = ? AND management_code = ?', 
      [attendance.session_id, management_code], (err, session) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!session) {
        return res.status(403).json({ error: 'Invalid management code' });
      }
      
      // remove the attendee
      db.run('DELETE FROM attendance WHERE id = ?', [attendanceId], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Attendee removed successfully' });
      });
    });
  });
});

module.exports = router;