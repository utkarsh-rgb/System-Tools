const express = require("express");
const router = express.Router();

const {
  addImage,
  showProduct,
  productDelete,
  productDetails,
  updateProduct,
  upload,
} = require("../Controllers/productController");

router.post('/dashboard/addproduct', upload.single("image"), addImage);


router.get('/dashboard/show_product', showProduct);


router.delete('/dashboard/delete/:id', productDelete);


router.get('/dashboard/product/:id', productDetails);


router.put('/dashboard/edit/:id', upload.single("image"), updateProduct);

module.exports = router;
