const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        name: { type: String, required: true },
        price: { type: String, required: true },
        originalPrice: { type: String },
        image: { type: String },
        discount: { type: String },
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
