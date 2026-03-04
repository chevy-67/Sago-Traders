const Order = require('../models/Order');

// POST /api/orders — place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if (!product || !quantity) {
            return res.status(400).json({ message: 'Product and quantity are required' });
        }

        const priceNum = parseFloat(product.price) || 0;
        const totalAmount = priceNum * quantity;

        const order = await Order.create({
            userId: req.user.userId,
            product,
            quantity,
            totalAmount,
            status: 'pending',
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        console.error('placeOrder error:', err);
        res.status(500).json({ message: 'Server error while placing order' });
    }
};

// GET /api/orders — get all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('getUserOrders error:', err);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
};
