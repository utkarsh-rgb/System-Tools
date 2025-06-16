const express = require("express");
const router = express.Router();
const { orders, orderItems, orderItemsById, updateOrderStatus,getUserNotifications,clearNotification} = require("../Controllers/orderController");

router.get('/dashboard/orders/:username', orders);
router.get('/dashboard/order-items', orderItems);
router.get('/dashboard/order-items/:id', orderItemsById); 
router.post('/dashboard/update-order-status', updateOrderStatus); 
router.get('/notification/:username', getUserNotifications);
router.delete('/notification/clear/:username', clearNotification);
module.exports = router;
