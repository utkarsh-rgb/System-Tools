const multer = require("multer");
const path = require("path");
const pool = require('../Models/db');

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
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { name, description, price } = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : null;

  if (!name || !description || !price || !imagePath) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) {
    return res.status(400).json({ error: "Invalid price" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, image_path) VALUES (?, ?, ?, ?)",
      [name, description, priceNum, imagePath]
    );

    res.json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Get All Products
const showProduct = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM products");
    res.json(results);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Delete Product
const productDelete = async (req, res) => {
  const productId = req.params.id;

  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Database error while deleting product" });
  }
};

// ✅ Get Product by ID
const productDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const [results] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};


// ✅ Update Product with optional image
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : req.body.image_path; // Keep old if not updated

  if (!name || !description || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE products SET name = ?, description = ?, price = ?, image_path = ? WHERE id = ?",
      [name, description, price, imagePath, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
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
