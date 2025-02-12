// pages/api/getinfo.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  
  const { password, action, fullname } = req.body;
  
  if (!password) {
    res.status(400).send('No password provided.');
    return;
  }
  if (password !== 'Mason1966') {
    res.status(403).send('Invalid password.');
    return;
  }
  if (!fullname) {
    res.status(400).send('User not identified.');
    return;
  }
  
  // Helper functions for banned status:
  async function isBanned(user) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM banned WHERE fullname = ?',
      [user]
    );
    return rows[0].count > 0;
  }
  
  async function banUser(user) {
    if (!(await isBanned(user))) {
      await pool.query('INSERT INTO banned (fullname) VALUES (?)', [user]);
    }
  }
  
  async function unbanUser(user) {
    await pool.query('DELETE FROM banned WHERE fullname = ?', [user]);
  }
  
  if (action === 'ban') {
    await banUser(fullname);
  } else if (action === 'unban') {
    await unbanUser(fullname);
  }
  
  // Retrieve all entries:
  const [entries] = await pool.query('SELECT fullname, grade FROM entries ORDER BY id DESC');
  
  const bannedStatus = await isBanned(fullname);
  
  let output = '';
  output += '<h2>All Entries</h2>';
  output += '<table style="width:100%; border-collapse: collapse; margin-top: 15px;">';
  output += '<tr><th>Full Name</th><th>Grade</th></tr>';
  for (const entry of entries) {
    output += `<tr><td>${entry.fullname}</td><td>${entry.grade}</td></tr>`;
  }
  output += '</table>';
  
  if (bannedStatus) {
    output += `<p style="color:red;">Current user (<strong>${fullname}</strong>) is banned.</p>`;
    output += `<button onclick="updateBan('unban')" style="background:green;color:white;">Unban</button>`;
    output += `<p style="display:none;">BANNED_STATUS:TRUE</p>`;
  } else {
    output += `<p style="color:green;">Current user (<strong>${fullname}</strong>) is not banned.</p>`;
    output += `<button onclick="updateBan('ban')" style="background:red;color:white;">Ban</button>`;
    output += `<p style="display:none;">BANNED_STATUS:FALSE</p>`;
  }
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(output);
}
