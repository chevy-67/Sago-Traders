const express = require('express');
const router = express.Router();
const {
  getSegments,
  spinWheel,
  adminGetConfig,
  adminUpdateConfig,
  getUserSpinStatus,
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

module.exports = router;
