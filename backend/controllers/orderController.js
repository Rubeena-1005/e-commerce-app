const pool = require('../config/database');

exports.createOrder = async (req, res) => {
  const { products, total_price } = req.body;
  const userId = req.user.id;

  const query = `INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'Pending') RETURNING *;`;
  
  try {
    const result = await pool.query(query, [userId, total_price]);
    const orderId = result.rows[0].id;

    products.forEach(async (product) => {
      const orderItemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4);`;
      await pool.query(orderItemQuery, [orderId, product.id, product.quantity, product.price]);
    });

    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
