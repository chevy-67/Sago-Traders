const SpinWheelOffer = require('../models/SpinWheelOffer');
const Coupon = require('../models/Coupon');
const generateCoupon = require('../utils/generateCoupon');

// Default segments seeded when none exist
const DEFAULT_SEGMENTS = [
  { label: '10% OFF',          color: '#E85D04', value: '10', type: 'percent' },
  { label: '₹50 Flat OFF',     color: '#3E2723', value: '50', type: 'flat'    },
  { label: 'Free Shipping',    color: '#1565C0', value: '0',  type: 'free_shipping' },
  { label: '5% OFF',           color: '#2E7D32', value: '5',  type: 'percent' },
  { label: 'Better Luck Next Time', color: '#757575', value: '0', type: 'none' },
  { label: '15% OFF',          color: '#AD1457', value: '15', type: 'percent' },
];

/** Ensure a single config doc exists */
async function getOrCreateConfig() {
  let config = await SpinWheelOffer.findOne();
  if (!config) {
    config = await SpinWheelOffer.create({ segments: DEFAULT_SEGMENTS });
  }
  return config;
}

// ─── Public: get active segments ─────────────────────────────────────────────
const getSegments = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({ segments: config.segments, isActive: config.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Protected (user): spin the wheel ────────────────────────────────────────
const spinWheel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const config = await getOrCreateConfig();

    // Check if user already spun
    const existing = config.spinRecords.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (existing) {
      return res.status(400).json({
        alreadySpun: true,
        message: 'You have already used your spin!',
        result: {
          index: existing.wonSegmentIndex,
          label: existing.wonLabel,
          value: existing.wonValue,
          type:  existing.wonType,
          couponCode: existing.couponCode,
        },
      });
    }

    if (!config.isActive) {
      return res.status(400).json({ message: 'Spin wheel is currently inactive.' });
    }

    // Count past wins for each segment
    const winCounts = {};
    config.spinRecords.forEach(r => {
      winCounts[r.wonSegmentIndex] = (winCounts[r.wonSegmentIndex] || 0) + 1;
    });

    // Check availability
    const availableSegmentIndices = [];
    config.segments.forEach((seg, idx) => {
      const wons = winCounts[idx] || 0;
      if (seg.maxWins && seg.maxWins > 0 && wons >= seg.maxWins) {
        // Limit reached, skip this segment
      } else {
        availableSegmentIndices.push(idx);
      }
    });

    if (availableSegmentIndices.length === 0) {
      return res.status(400).json({ message: 'No offers currently available!' });
    }

    // Pick a random segment from the available ones
    const randomPick = Math.floor(Math.random() * availableSegmentIndices.length);
    const wonIndex = availableSegmentIndices[randomPick];
    const won = config.segments[wonIndex];
    let couponCode = null;

    if (won.type !== 'none') {
      couponCode = generateCoupon(8);
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 14);

      await Coupon.create({
        user: userId,
        code: couponCode,
        discountId: won.discountId || null,
        discountType: won.type,
        discountValue: Number(won.value) || 0,
        validUntil,
        isSpinWheelPrize: true,
        isActive: true
      });
    }

    config.spinRecords.push({
      userId,
      wonSegmentIndex: wonIndex,
      wonLabel: won.label,
      wonValue: won.value,
      wonType:  won.type,
      discountId: won.discountId || null,
      couponCode
    });
    await config.save();

    res.json({
      alreadySpun: false,
      result: {
        index: wonIndex,
        label: won.label,
        value: won.value,
        type:  won.type,
        couponCode
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Admin: get full config + spin records ────────────────────────────────────
const adminGetConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    const populated = await SpinWheelOffer.findById(config._id).populate(
      'spinRecords.userId', 'name email phone'
    );
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Admin: update segments ───────────────────────────────────────────────────
const adminUpdateConfig = async (req, res) => {
  try {
    const { segments, isActive } = req.body;
    const config = await getOrCreateConfig();

    if (segments !== undefined) config.segments = segments;
    if (isActive !== undefined) config.isActive = isActive;

    await config.save();
    res.json({ message: 'Wheel config updated', segments: config.segments, isActive: config.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Admin: check if specific user has spun ──────────────────────────────────
const getUserSpinStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const config = await getOrCreateConfig();
    const record = config.spinRecords.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (record) {
      return res.json({
        alreadySpun: true,
        result: {
          index: record.wonSegmentIndex,
          label: record.wonLabel,
          value: record.wonValue,
          type:  record.wonType,
          couponCode: record.couponCode,
        },
      });
    }
    res.json({ alreadySpun: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const adminGetCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isSpinWheelPrize: true }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const adminDeleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSegments, spinWheel, adminGetConfig, adminUpdateConfig, getUserSpinStatus, adminGetCoupons, adminDeleteCoupon };
