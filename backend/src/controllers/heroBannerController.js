const HeroBanner = require('../models/HeroBanner');

// GET /api/banners — public, returns all active banners sorted by order
const getBanners = async (req, res) => {
    try {
        const banners = await HeroBanner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/banners/all — admin, returns ALL banners (including inactive)
const getAllBanners = async (req, res) => {
    try {
        const banners = await HeroBanner.find().sort({ order: 1, createdAt: 1 });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /api/banners — admin, create a new banner
const createBanner = async (req, res) => {
    try {
        const banner = await HeroBanner.create(req.body);
        res.status(201).json(banner);
    } catch (err) {
        res.status(400).json({ message: 'Create failed', error: err.message });
    }
};

// PUT /api/banners/:id — admin, update a banner
const updateBanner = async (req, res) => {
    try {
        const banner = await HeroBanner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.json(banner);
    } catch (err) {
        res.status(400).json({ message: 'Update failed', error: err.message });
    }
};

// DELETE /api/banners/:id — admin, delete a banner
const deleteBanner = async (req, res) => {
    try {
        await HeroBanner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };
