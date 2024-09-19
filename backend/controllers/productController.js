const pool = require('../config/database');

exports.getProducts = async (req, res) => {
  const query = `SELECT * FROM products;`;
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const query = `
    INSERT INTO products (name, description, price, stock)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  
  try {
    const result = await pool.query(query, [name, description, price, stock]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
