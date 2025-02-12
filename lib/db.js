// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',           // Replace with your DB username
  password: process.env.DB_PASSWORD || 'mypassword', // Replace with your DB password
  database: process.env.DB_NAME || 'mydatabase',     // Replace with your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
