const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    isin: { type: String },
    offerId: { type: String },
    modelNumber: { type: String },
    collectionName: { type: String },
    size: { type: String },
    colour: { type: String },
    material: { type: String },
    packOf: { type: String },
    countryOfOrigin: { type: String },
    customerCareAddress: { type: String },
    manufacturedBy: { type: String },
    packedBy: { type: String },
    imageUrl: { type: String },   // stored as base64 or URL
    offer: {
        discountPercent: { type: Number, default: 0 },
        offerLabel: { type: String, default: '' },
        offerExpiry: { type: Date },
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
