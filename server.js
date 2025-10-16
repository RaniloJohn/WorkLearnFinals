const validator = require('validator');
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');  // Add this for code generation
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());  // Adjust origin for your setup

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/login', limiter);
app.use('/api/register', limiter);
app.use('/api/verify-code', limiter);  // Add limiter for new endpoint

const transporter = nodemailer.createTransport({  // Fixed: was createTransporter
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Temporary storage for pending registrations (use DB for production)
const tempUsers = {};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing fields' });

  try {
    const [rows] = await pool.query('SELECT id, email, password_hash, role, verified FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    if (!user.verified) return res.status(401).json({ ok: false, message: 'Email not verified' });

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

  // Email validation
  if (!validator.isEmail(email)) return res.status(400).json({ ok: false, message: 'Invalid email' });

  // Password strength validation
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (password.length < minLength || !hasLetter || !hasNumber || !hasSymbol) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 8 characters long and include letters, numbers, and symbols.' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ ok: false, message: 'Email already exists' });

    // Generate 6-digit code
    const verificationCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const hash = await bcrypt.hash(password, 10);
    // Store temporarily (expires in 10 minutes)
    tempUsers[email] = { fullName, email, password_hash: hash, role: 'user', code: verificationCode, expires: Date.now() + 10 * 60 * 1000 };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${verificationCode}. Enter it to complete registration.`
    });

    return res.json({ ok: true, message: 'Verification code sent to your email. Enter it to complete registration.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// New endpoint to verify code and create account
app.post('/api/verify-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ ok: false, message: 'Email and code required' });

  const tempUser = tempUsers[email];
  if (!tempUser || tempUser.code !== code || Date.now() > tempUser.expires) {
    return res.status(400).json({ ok: false, message: 'Invalid or expired code' });
  }

  try {
    await pool.query('INSERT INTO users (fullName, email, password_hash, role, verified) VALUES (?, ?, ?, ?, TRUE)', [tempUser.fullName, tempUser.email, tempUser.password_hash, tempUser.role]);
    delete tempUsers[email];
    return res.json({ ok: true, message: 'Account created successfully! You can now log in.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Remove the old /verify route since we're using code now
// app.get('/verify', ...);  // Commented out or removed

const PORT = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(PORT, () => console.log(`Auth server listening on https://localhost:${PORT}`));