const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  label:    { type: String, required: true },
  color:    { type: String, required: true, default: '#E85D04' },
  value:    { type: String, default: '0' },   // e.g. "10" for 10% or "50" for ₹50
  type:     {
    type: String,
    enum: ['percent', 'flat', 'free_shipping', 'none','free_product'],
    default: 'none'
  }
}, { _id: false });

const spinRecordSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wonSegmentIndex: { type: Number, required: true },
  wonLabel:        { type: String },
  wonValue:        { type: String },
  wonType:         { type: String },
  spunAt:          { type: Date, default: Date.now }
}, { _id: false });

const spinWheelOfferSchema = new mongoose.Schema({
  segments:    { type: [segmentSchema], default: [] },
  spinRecords: { type: [spinRecordSchema], default: [] },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SpinWheelOffer', spinWheelOfferSchema);
