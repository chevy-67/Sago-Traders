const mongoose = require('mongoose');

const demandPredictionSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    // Historical data
    totalOrders: {
        type: Number,
        default: 0
    },
    averageOrderQuantity: {
        type: Number,
        default: 0
    },
    totalQuantitySold: {
        type: Number,
        default: 0
    },
    // Prediction data
    predictedDemand: {
        type: Number,
        default: 0
    },
    demandLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        default: 'low'
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    // Trending data
    trendingDirection: {
        type: String,
        enum: ['increasing', 'decreasing', 'stable'],
        default: 'stable'
    },
    monthlyTrend: [
        {
            month: String,
            quantity: Number,
            orders: Number
        }
    ],
    // Model metadata
    modelVersion: {
        type: String,
        default: '1.0'
    },
    trainingDataPoints: {
        type: Number,
        default: 0
    },
    modelAccuracy: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    lastTrainingDate: {
        type: Date
    },
    nextPredictionDate: {
        type: Date
    },
    // Recommendations
    recommendedStockLevel: {
        type: Number,
        default: 0
    },
    seasonalityFactor: {
        type: Number,
        default: 1
    },
    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending-training'],
        default: 'pending-training'
    }
}, { timestamps: true });

module.exports = mongoose.model('DemandPrediction', demandPredictionSchema);
