const express = require('express');
const router = express.Router();
const {
  getSegments,
  spinWheel,
  adminGetConfig,
  adminUpdateConfig,
  getUserSpinStatus,
  adminGetCoupons,
  adminDeleteCoupon,
} = require('../controllers/spinWheelController');
const protect = require('../middlewares/authMiddleware');

// Public — returns active segments
router.get('/', getSegments);

// Protected (logged-in user)
router.get('/status', protect, getUserSpinStatus);   // did I already spin?
router.post('/spin', protect, spinWheel);             // actually spin

// Admin only
router.get('/admin', protect, adminGetConfig);
router.put('/admin', protect, adminUpdateConfig);
router.get('/admin/coupons', protect, adminGetCoupons);
router.delete('/admin/coupons/:id', protect, adminDeleteCoupon);

module.exports = router;
