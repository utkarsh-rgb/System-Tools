const pool = require('../Models/db');

const cart = async (req, res) => {
  const { userData, cartItems } = req.body;

  if (
    !userData ||
    !cartItems ||
    !Array.isArray(cartItems) ||
    cartItems.length === 0
  ) {
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

  console.log("Cart Items:", cartItems);
  console.log("Calculated total order price:", totalOrderPrice);

  const connection = await pool.getConnection(); // ✅ fixed

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (username, total_order_price) VALUES (?, ?)`,
      [username, totalOrderPrice]
    );

    const orderId = orderResult.insertId;

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
    }

    await connection.commit();
    res.status(201).json({ message: "Order saved successfully", orderId });
  } catch (error) {
    await connection.rollback();
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to save order" });
  } finally {
    connection.release();
  }
};

module.exports = { cart };
