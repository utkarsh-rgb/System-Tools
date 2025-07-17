const pool = require('../Models/db');
const logger = require('../Logs/logger');

const cart = async (req, res) => {
  const { userData, cartItems } = req.body;

  if (
    !userData ||
    !cartItems ||
    !Array.isArray(cartItems) ||
    cartItems.length === 0
  ) {
    logger.warn("Cart submission failed: Missing or invalid userData or cartItems");
    return res
      .status(400)
      .json({ message: "Missing or invalid userData or cartItems" });
  }

  const username = userData.username;

  const totalOrderPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  logger.info(`User ${username} submitted a cart with total price ₹${totalOrderPrice.toFixed(2)}`);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (username, total_order_price) VALUES (?, ?)`,
      [username, totalOrderPrice]
    );

    const orderId = orderResult.insertId;
    logger.info(`New order created: OrderID=${orderId}, User=${username}`);

    for (const item of cartItems) {
      const {
        id: productId,
        name: productName,
        price: pricePerUnit,
        quantity,
      } = item;

      const finalQuantity = quantity ?? 1;

      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, price_per_unit, quantity) VALUES (?, ?, ?, ?, ?)`,
        [orderId, productId, productName, pricePerUnit, finalQuantity]
      );

      logger.info(`Order item added: OrderID=${orderId}, Product=${productName}, Qty=${finalQuantity}`);
    }

    await connection.commit();
    logger.info(`Order successfully saved for ${username}, OrderID=${orderId}`);

    res.status(201).json({ message: "Order saved successfully", orderId });
  } catch (error) {
    await connection.rollback();
    logger.error(`Order save failed for ${username}: ${error.message}`);
    res.status(500).json({ message: "Failed to save order" });
  } finally {
    connection.release();
  }
};

module.exports = { cart };
