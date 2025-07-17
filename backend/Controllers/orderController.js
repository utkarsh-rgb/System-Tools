const pool = require('../Models/db');
const { getIO, connectedUsers } = require('../utlis/socket');
const Logger = require('../Logs/logger');

// 🔹 Fetch all orders for a user
const orders = async (req, res) => {
  const username = req.params.username;

  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE username = ? ORDER BY order_date DESC",
      [username]
    );

    if (orders.length === 0) {
      Logger.info(`No orders found for user: ${username}`);
      return res.status(404).json({ message: "No orders found for this user" });
    }

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.price as unit_price
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?
         ORDER BY oi.id DESC`,
        [order.id]
      );
      order.items = items;
    }

    Logger.info(`Fetched ${orders.length} orders for user: ${username}`);
    res.json(orders);
  } catch (error) {
    Logger.error(`Error fetching user orders for ${username}: ${error.stack}`);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Fetch grouped order items (all orders)
const orderItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         oi.order_id,
         p.name AS product_name,
         p.price AS unit_price,
         oi.quantity,
         (p.price * oi.quantity) AS total_price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       ORDER BY oi.order_id DESC, oi.id DESC`
    );

    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.order_id]) grouped[row.order_id] = [];
      grouped[row.order_id].push({
        product_name: row.product_name,
        unit_price: row.unit_price,
        quantity: row.quantity,
        total_price: row.total_price,
      });
    }

    Logger.info(`Fetched grouped order items. Total rows: ${rows.length}`);
    res.json(grouped);
  } catch (error) {
    Logger.error(`Error fetching full order details: ${error.stack}`);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Fetch full details of a specific order by ID
const orderItemsById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [rows] = await pool.query(
      `SELECT 
         o.id AS order_id,
         o.username,
         u.name AS user_name,
         u.email AS user_email,
         o.total_order_price,
         o.order_date,
         oi.id AS order_item_id,
         oi.product_id,
         oi.product_name,
         oi.price_per_unit,
         oi.quantity,
         (oi.price_per_unit * oi.quantity) AS total_price_per_item
       FROM orders o
       JOIN users u ON o.username = u.username
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = ?
       ORDER BY oi.id ASC`,
      [orderId]
    );

    if (rows.length === 0) {
      Logger.info(`Order with ID ${orderId} not found.`);
      return res.status(404).json({ message: "Order not found" });
    }

    Logger.info(`Fetched full details for order ID: ${orderId}`);
    res.json(rows);
  } catch (error) {
    Logger.error(`Error fetching order by ID ${orderId}: ${error.stack}`);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update order status and send notification
const updateOrderStatus = async (req, res) => {
  const { orderId, username, status, message } = req.body;

  if (!orderId || !username || !status || !message) {
    Logger.warn("Missing required fields in updateOrderStatus request.");
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    Logger.info(`Updating order ${orderId} to status "${status}" for user ${username}`);

    await pool.query('UPDATE orders SET status = ?, status_timestamp = NOW() WHERE id = ?', [status, orderId]);
    await pool.query('INSERT INTO notifications (username, message, created_at) VALUES (?, ?, NOW())', [username, message]);

    const socketId = connectedUsers.get(username);
    const io = getIO();

    if (socketId) {
      io.to(socketId).emit('notification', {
        orderId,
        status,
        message,
        timestamp: new Date(),
      });
      Logger.info(`✅ Sent notification to ${username}`);
    } else {
      Logger.warn(`⚠️ User ${username} is not connected`);
    }

    return res.json({ message: 'Order status updated and notification sent.' });
  } catch (error) {
    Logger.error(`❌ Error updating order status: ${error.stack}`);
    return res.status(500).json({ message: 'Server error updating status.' });
  }
};

// 🔹 Get notifications for a user
const getUserNotifications = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT message, created_at FROM notifications WHERE username = ? ORDER BY created_at DESC',
      [username]
    );

    Logger.info(`Fetched ${rows.length} notifications for user: ${username}`);
    res.json(rows);
  } catch (err) {
    Logger.error(`❌ Error fetching notifications for ${username}: ${err.stack}`);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// 🔹 Clear all notifications for a user
const clearNotification = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(`DELETE FROM notifications WHERE username = ?`, [username]);
    Logger.info(`Cleared notifications for user: ${username}`);
    res.json(rows);
  } catch (err) {
    Logger.error(`❌ Error clearing notifications for ${username}: ${err.stack}`);
    res.status(500).json({ message: 'Failed to clear notifications' });
  }
};

module.exports = {
  orders,
  orderItems,
  orderItemsById,
  updateOrderStatus,
  getUserNotifications,
  clearNotification,
};
