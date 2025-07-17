const pool = require('../Models/db');
const logger = require('../Logs/logger'); // 🔥 Import winston logger

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

    logger.info("✅ Admin dashboard fetched for today");
    res.json(rows);
  } catch (err) {
    logger.error(`❌ SQL ERROR in adminDashboard: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
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

    logger.info("📊 Admin dashboard history fetched successfully");
    res.json(rows);
  } catch (err) {
    logger.error(`❌ SQL ERROR in adminDashboardHistory: ${err.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { adminDashboard, adminDashboardHistory };
