// filepath: c:\Users\admin\OneDrive\Desktop\WORKLEARN FINALS\create-user.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const users = [
    { email: 'delosangeles.ranilojohn@ue.edu.ph', password: '12345', role: 'user' },
    { email: 'WorklearnAdmin@visa.com', password: 'Password123', role: 'company' }
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    try {
      await pool.query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [u.email, hash, u.role]);
      console.log('Inserted', u.email);
    } catch (err) {
      console.error('Skip/failed insert for', u.email, err.message);
    }
  }
  await pool.end();
})();