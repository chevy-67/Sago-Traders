const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { placeOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);

module.exports = router;
