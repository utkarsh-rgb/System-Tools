const pool = require('../Models/db');
const { getIO, connectedUsers } = require('../utlis/socket');

// 🔹 Fetch all orders for a user
const orders = async (req, res) => {
  const username = req.params.username;

  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE username = ? ORDER BY order_date DESC",
      [username]
    );

    if (orders.length === 0) {
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

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
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

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching full order details:", error);
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
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update order status and send notification

const updateOrderStatus = async (req, res) => {
  const { orderId, username, status, message } = req.body;

  if (!orderId || !username || !status || !message) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    console.log(`Updating order ${orderId} to status "${status}" for user ${username}`);

    // Update order in DB
    await pool.query('UPDATE orders SET status = ? , status_timestamp = NOW()WHERE id = ?', [status, orderId]);

    // Save notification in DB
    await pool.query('INSERT INTO notifications (username, message, created_at) VALUES (?, ?, NOW())', [username, message]);

    // Send real-time notification
    const socketId = connectedUsers.get(username);
    const io = getIO();

    if (socketId) {
      io.to(socketId).emit('notification', {
        orderId,
        status,
        message,
        timestamp: new Date(),
      });
      console.log(`✅ Sent notification to ${username}`);
    } else {
      console.log(`⚠️ User ${username} is not connected`);
    }

    return res.json({ message: 'Order status updated and notification sent.' });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return res.status(500).json({ message: 'Server error updating status.' });
  }
};


const getUserNotifications = async (req, res) => {
  const { username } = req.params;
  console.log('req.params');

  try {
    const [rows] = await pool.query(
      'SELECT message, created_at FROM notifications WHERE username = ? ORDER BY created_at DESC',
      [username]
    );
    console.log(rows)
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

const clearNotification= async (req, res) => {
  const { username } = req.params;
  console.log('req.params');
  try{
 const [rows] = await pool.query(`DELETE FROM notifications WHERE username = ?`, [username]);
  
  res.json(rows);
}
  catch(err){
    console.log(err);
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
