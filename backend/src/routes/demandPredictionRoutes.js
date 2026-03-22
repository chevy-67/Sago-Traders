const express = require("express");
const router = express.Router();
const demandPredictionController = require("../controllers/demandPredictionController");
const protect = require("../middlewares/authMiddleware");

/**
 * POST /api/ml/train
 * Train ML model (requires admin privileges)
 */
router.post("/train", protect, demandPredictionController.trainModel);

/**
 * GET /api/ml/prediction/:productId
 * Get demand prediction for a specific product
 */
router.get("/prediction/:productId", demandPredictionController.getPrediction);

/**
 * PUT /api/ml/prediction/:productId/refresh
 * Force-refresh demand prediction for a specific product
 */
router.put("/prediction/:productId/refresh", demandPredictionController.refreshPrediction);

/**
 * GET /api/ml/predictions
 * Get all demand predictions with optional filtering
 * Query params: category, demandLevel, sortBy
 */
router.get("/predictions", demandPredictionController.getAllPredictions);

/**
 * GET /api/ml/analytics
 * Get demand prediction analytics/dashboard data
 */
router.get("/analytics", demandPredictionController.getAnalytics);

/**
 * PATCH /api/ml/prediction/:predictionId/status
 * Update prediction status (requires admin privileges)
 */
router.patch(
  "/prediction/:predictionId/status",
  protect,
  demandPredictionController.updatePredictionStatus,
);

module.exports = router;
