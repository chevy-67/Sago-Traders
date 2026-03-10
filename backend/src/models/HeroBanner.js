const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    mediaUrl: { type: String, required: true },   // base64 or URL
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    link: { type: String, default: '' },           // CTA button URL
    linkLabel: { type: String, default: 'Shop Now' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
