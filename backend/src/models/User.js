const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "customer"
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    alternatePhone: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true }
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)