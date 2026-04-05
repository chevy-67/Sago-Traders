const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount',
        required: false
    },
    discountType: {
        type: String,
        enum: ['percent', 'flat', 'free_shipping', 'none', 'free_product'],
        default: 'none'
    },
    discountValue: {
        type: Number,
        default: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: Infinity
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isSpinWheelPrize: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);