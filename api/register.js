// pages/api/register.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }
  
  const { fullname, grade } = req.body;
  if (!fullname || !grade) {
    res.status(400).json({ error: 'Missing fullname or grade' });
    return;
  }
  
  try {
    await pool.query(
      'INSERT INTO entries (fullname, grade) VALUES (?, ?)',
      [fullname, grade]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
