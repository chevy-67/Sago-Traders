const Order = require('../models/Order');

// POST /api/orders — place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { items, product, quantity, name, phone, alternatePhone, address, city, state, pincode, notes } = req.body;

        // Support both: cart checkout (items array) and legacy single-product (product + quantity)
        if (!items && (!product || !quantity)) {
            return res.status(400).json({ message: 'Product and quantity are required' });
        }

        let totalAmount = 0;
        let orderProduct = product;
        let orderQuantity = quantity;

        if (items && items.length > 0) {
            // Multi-item cart checkout
            totalAmount = items.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (i.quantity || 1), 0);
            // Store first item as primary product for the schema (keeps backward compat)
            orderProduct = { name: items[0].name, price: String(items[0].price), image: items[0].image };
            orderQuantity = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
        } else {
            const priceNum = parseFloat(product.price) || 0;
            totalAmount = priceNum * quantity;
        }

        const order = await Order.create({
            userId: req.user.userId,
            product: orderProduct,
            quantity: orderQuantity,
            totalAmount,
            status: 'pending',
            // Store full delivery details
            deliveryDetails: { name, phone, alternatePhone, address, city, state, pincode, notes },
            // Store all cart items
            items: items || [{ ...orderProduct, quantity: orderQuantity }],
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

// GET /api/orders/admin/all — admin: get ALL orders with user info
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name phone email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('getAllOrders error:', err);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
};

// PATCH /api/orders/admin/:id/status — admin: update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after' }
        ).populate('userId', 'name phone email');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json({ message: 'Status updated', order });
    } catch (err) {
        console.error('updateOrderStatus error:', err);
        res.status(500).json({ message: 'Server error while updating status' });
    }
};
