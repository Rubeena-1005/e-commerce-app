const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [username, email, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = $1;`;
  
  try {
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
