const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const User = require('../models/User');
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/orderController');

// Admin-only guard — looks up role from DB, not JWT, so it works with old tokens too
const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('role');
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Auth check failed' });
    }
};

// Customer routes
router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);
router.post('/razorpay-create', protect, createRazorpayOrder);
router.post('/razorpay-verify', protect, verifyRazorpayPayment);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;

