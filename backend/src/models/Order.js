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
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
        default: 'pending',
    },
    deliveryDetails: {
        name: { type: String },
        phone: { type: String },
        alternatePhone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        notes: { type: String },
    },
    items: [
        {
            name: { type: String },
            price: { type: String },
            image: { type: String },
            quantity: { type: Number },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
