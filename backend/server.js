const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Hobby Session API is running' });
});

// import session routes
const sessionRoutes = require('./routes/sessions');
const attendanceRoutes = require('./routes/attendance');

app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});