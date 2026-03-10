const express = require('express');
const router = express.Router();
const { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/heroBannerController');
const protect = require('../middlewares/authMiddleware');

// Public — Hero page fetches this
router.get('/', getBanners);

// Admin only
router.get('/all', protect, getAllBanners);
router.post('/', protect, createBanner);
router.put('/:id', protect, updateBanner);
router.delete('/:id', protect, deleteBanner);

module.exports = router;
