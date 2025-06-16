const pool = require('../Models/db');

const adminDashboard = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        order_items.product_name,
        SUM(order_items.quantity) AS total_quantity,
        orders.order_date
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      WHERE DATE(orders.order_date) = CURDATE()
      GROUP BY orders.order_date, order_items.product_name
      ORDER BY orders.order_date DESC;`
    );

    console.log("Fetched admin orders:", rows);
    res.json(rows);
  } catch (err) {
    console.error("🔥 SQL ERROR in /admin/orders route:", err);
    res.status(500).json({ error: err.message });
  }
};

const adminDashboardHistory = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        order_items.product_name,
        SUM(order_items.quantity) AS total_quantity,
        orders.order_date
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      GROUP BY orders.order_date, order_items.product_name
      ORDER BY orders.order_date DESC;`
    );

    console.log("Fetched admin orders:", rows);
    res.json(rows);
  } catch (err) {
    console.error("🔥 SQL ERROR in /admin/orders route:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { adminDashboard, adminDashboardHistory };
