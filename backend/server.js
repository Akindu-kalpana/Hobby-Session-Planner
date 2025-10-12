const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Hobby Session API is running' });
});

// import routes
const sessionRoutes = require('./routes/sessions');
const attendanceRoutes = require('./routes/attendance');
const aiRoutes = require('./routes/ai');

app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/ai', aiRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});