const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Adjust origin for your setup

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// rate limiting 
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/login', limiter);
app.use('/api/register', limiter);


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

app.post('/api/register', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  if (!fullName || !email || !password || !confirmPassword) return res.status(400).json({ ok: false, message: 'All fields required' });
  if (password !== confirmPassword) return res.status(400).json({ ok: false, message: 'Passwords do not match' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ ok: false, message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, hash, 'user']);
    return res.json({ ok: true, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(PORT, () => console.log(`Auth server listening on https://localhost:${PORT}`));