const express = require("express");
const router= express.Router()

const {cart} = require("../Controllers/cartController");



router.post('/dashboard/cart',cart);


module.exports=router