// filepath: c:\Users\admin\OneDrive\Desktop\WORKLEARN FINALS\server.js
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());// Adjust origin for your setup

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing fields' });

  try {
    const [rows] = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const redirect = user.role === 'company' ? 'Homepagecompany.html' : 'profile.html';
    return res.json({ ok: true, redirect });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth server listening on ${PORT}`));