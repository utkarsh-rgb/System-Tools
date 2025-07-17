const multer = require("multer");
const path = require("path");
const pool = require('../Models/db');
const Logger = require('../Logs/logger');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Add Image
const addImage = async (req, res) => {
  Logger.info("Adding new product with image");
  Logger.info(`Request body: ${JSON.stringify(req.body)}`);
  Logger.info(`Uploaded file: ${JSON.stringify(req.file)}`);

  const { name, description, price } = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : null;

  if (!name || !description || !price || !imagePath) {
    Logger.warn("Missing required fields while adding product.");
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) {
    Logger.warn("Invalid price provided.");
    return res.status(400).json({ error: "Invalid price" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, image_path) VALUES (?, ?, ?, ?)",
      [name, description, priceNum, imagePath]
    );

    Logger.info(`Product added successfully with ID: ${result.insertId}`);
    res.json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (err) {
    Logger.error(`Database error while adding product: ${err.stack}`);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Get All Products
const showProduct = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM products");
    Logger.info(`Fetched ${results.length} products`);
    res.json(results);
  } catch (err) {
    Logger.error(`Error fetching products: ${err.stack}`);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Delete Product
const productDelete = async (req, res) => {
  const productId = req.params.id;

  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [productId]);

    if (result.affectedRows === 0) {
      Logger.warn(`Product with ID ${productId} not found for deletion.`);
      return res.status(404).json({ error: "Product not found" });
    }

    Logger.info(`Product with ID ${productId} deleted successfully`);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    Logger.error(`Error deleting product ID ${productId}: ${err.stack}`);
    res.status(500).json({ error: "Database error while deleting product" });
  }
};

// ✅ Get Product by ID
const productDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const [results] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

    if (results.length === 0) {
      Logger.warn(`Product with ID ${id} not found.`);
      return res.status(404).json({ error: "Product not found" });
    }

    Logger.info(`Fetched details for product ID ${id}`);
    res.json(results[0]);
  } catch (err) {
    Logger.error(`Database error while fetching product ID ${id}: ${err.stack}`);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Update Product with optional image
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : req.body.image_path;

  if (!name || !description || !price) {
    Logger.warn(`Missing fields while updating product ID ${productId}`);
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE products SET name = ?, description = ?, price = ?, image_path = ? WHERE id = ?",
      [name, description, price, imagePath, productId]
    );

    if (result.affectedRows === 0) {
      Logger.warn(`Product with ID ${productId} not found for update.`);
      return res.status(404).json({ error: "Product not found" });
    }

    Logger.info(`Product ID ${productId} updated successfully`);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    Logger.error(`Error updating product ID ${productId}: ${err.stack}`);
    res.status(500).json({ error: "Database error while updating product" });
  }
};

module.exports = {
  addImage,
  showProduct,
  productDelete,
  productDetails,
  updateProduct,
  upload
};
