const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');

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
            totalAmount = items.reduce((sum, i) => sum + (parseFloat((i.price).replaceAll(',','')) || 0) * (i.quantity || 1), 0);
            // Store first item as primary product for the schema (keeps backward compat)
            orderProduct = { name: items[0].name, price: String(items[0].price), image: items[0].image };
            orderQuantity = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
        } else {
            const priceNum = parseFloat((product.price).replaceAll(',','')) || 0;
            totalAmount = priceNum * quantity;
        }

        const order = await Order.create({
            userId: req.user.userId,
            product: orderProduct,
            quantity: orderQuantity,
            totalAmount: totalAmount.toLocaleString('en-IN'),
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

// POST /api/orders/razorpay-create — Initialize Razorpay order
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
        });

        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const razorpayOrder = await instance.orders.create(options);

        if (!razorpayOrder) {
            return res.status(500).json({ message: 'Failed to create Razorpay order' });
        }

        res.json(razorpayOrder);
    } catch (err) {
        console.error('createRazorpayOrder error:', err);
        res.status(500).json({ message: 'Server error while creating Razorpay order', error: err.message });
    }
};

// POST /api/orders/razorpay-verify — Verify payment and save order
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification details missing' });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        // Payment is verified, save order to DB
        const { items, product, quantity, name, phone, alternatePhone, address, city, state, pincode, notes } = orderData;

        let totalAmount = 0;
        let orderProduct = product;
        let orderQuantity = quantity;

        if (items && items.length > 0) {
            totalAmount = items.reduce((sum, i) => sum + (parseFloat((String(i.price)).replaceAll(',', '')) || 0) * (i.quantity || 1), 0);
            orderProduct = { name: items[0].name, price: String(items[0].price), image: items[0].image };
            orderQuantity = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
        } else {
            const priceNum = parseFloat((String(product.price)).replaceAll(',', '')) || 0;
            totalAmount = priceNum * quantity;
        }

        const order = await Order.create({
            userId: req.user.userId,
            product: orderProduct,
            quantity: orderQuantity,
            totalAmount: totalAmount.toLocaleString('en-IN'),
            status: 'confirmed',
            paymentStatus: 'paid',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            deliveryDetails: { name, phone, alternatePhone, address, city, state, pincode, notes },
            items: items || [{ ...orderProduct, quantity: orderQuantity }],
        });

        res.status(201).json({ message: 'Order placed & payment verified successfully', order });
    } catch (err) {
        console.error('verifyRazorpayPayment error:', err);
        res.status(500).json({ message: 'Server error while verifying payment' });
    }
};
