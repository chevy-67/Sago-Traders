const DemandPrediction = require("../models/DemandPrediction");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { spawn } = require("child_process");
const path = require("path");

/**
 * Train ML model on all products' order history
 */
exports.trainModel = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found to train on",
      });
    }

    // Fetch all orders grouped by product (accept any status for training)
    const orders = await Order.find({});

    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No orders found to train on",
      });
    }

    // Group orders by product
    const productOrders = {};
    const categoryStats = {};

    orders.forEach((order) => {
      const productName = order.product?.name;
      if (!productName) return;

      if (!productOrders[productName]) {
        productOrders[productName] = [];
      }

      productOrders[productName].push({
        date: order.createdAt.toISOString(),
        quantity: order.quantity,
        price: parseFloat(order.product.price),
        discount_percent: order.product.discount
          ? parseFloat(order.product.discount)
          : 0,
      });
    });

    // Calculate category statistics
    products.forEach((product) => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = { total_orders: 0, count: 0 };
      }
      categoryStats[product.category].total_orders +=
        productOrders[product.name]?.length || 0;
      categoryStats[product.category].count += 1;
    });

    // Calculate average orders per category
    Object.keys(categoryStats).forEach((category) => {
      const stats = categoryStats[category];
      stats.avg_orders = stats.total_orders / stats.count;
    });

    // Prepare training data
    const trainingData = products
      .filter((p) => productOrders[p.name])
      .map((p) => ({
        orders: productOrders[p.name],
        category: p.category,
        price: parseFloat(p.price),
        discount: p.offer?.discountPercent || 0,
      }));

    // Call Python ml_service.py to train
    const result = await trainMLModel(trainingData, categoryStats);

    // After successful training, update predictions for all products (bulk update)
    const predictionResults = [];
    for (const product of products) {
      try {
        const pred = await internalGeneratePrediction(product._id);
        predictionResults.push(pred);
      } catch (err) {
        console.error(`Error generating prediction for ${product.name}:`, err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Model training completed and predictions updated",
      result: result,
      predictionsCount: predictionResults.length,
    });
  } catch (error) {
    console.error("Training error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during model training",
      error: error.message,
    });
  }
};

/**
 * Internal helper to generate or refresh prediction for a product
 */
async function internalGeneratePrediction(productId) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Fetch product orders (include all statuses for better ML data)
  const orders = await Order.find({
    "product.name": product.name,
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const quantities = orders.map((o) => o.quantity);
  const avgQuantity =
    quantities.length > 0
      ? quantities.reduce((a, b) => a + b, 0) / quantities.length
      : 0;
  const totalQuantity = quantities.reduce((a, b) => a + b, 0);

  // Get monthly trend
  const monthlyTrend = calculateMonthlyTrend(orders);

  // Get category stats for all categories
  const categoryStats = await getCategoryStatistics();

  // Call Python to get prediction
  const predictionResult = await getPredictionFromML(
    orders,
    product.category,
    parseFloat(product.price),
    product.offer?.discountPercent || 0,
    categoryStats,
  );

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const predictionData = {
    productId: product._id,
    productName: product.name,
    category: product.category,
    totalOrders,
    averageOrderQuantity: avgQuantity,
    totalQuantitySold: totalQuantity,
    predictedDemand: predictionResult.predicted_demand,
    demandLevel: predictionResult.demand_level,
    confidenceScore: predictionResult.confidence_score,
    trendingDirection: predictionResult.trending_direction,
    monthlyTrend,
    trainingDataPoints: totalOrders,
    modelAccuracy: predictionResult.confidence_score,
    lastTrainingDate: new Date(),
    nextPredictionDate: new Date(Date.now() + SEVEN_DAYS_MS),
    recommendedStockLevel: predictionResult.recommended_stock_level,
    seasonalityFactor: calculateSeasonalityFactor(),
    status: "active",
  };

  // Upsert — update if exists, create if new
  return await DemandPrediction.findOneAndUpdate(
    { productId: product._id },
    predictionData,
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

/**
 * Get demand prediction for a specific product
 */
exports.getPrediction = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if prediction already exists and is fresh (< 7 days old)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    let prediction = await DemandPrediction.findOne({ productId });

    if (prediction && prediction.lastTrainingDate) {
      const age = Date.now() - new Date(prediction.lastTrainingDate).getTime();
      if (age < SEVEN_DAYS_MS) {
        return res.status(200).json({
          success: true,
          prediction: prediction,
        });
      }
    }

    // Refresh prediction
    prediction = await internalGeneratePrediction(productId);

    return res.status(200).json({
      success: true,
      prediction: prediction,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating prediction",
      error: error.message,
    });
  }
};

/**
 * Force refresh demand prediction for a specific product
 */
exports.refreshPrediction = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Refresh prediction
    prediction = await internalGeneratePrediction(productId);

    return res.status(200).json({
      success: true,
      message: "Prediction refreshed successfully",
      prediction,
    });
  } catch (error) {
    console.error("Refresh prediction error:", error);
    return res.status(500).json({
      success: false,
      message: "Error refreshing prediction",
      error: error.message,
    });
  }
};

/**
 * Get all demand predictions with filtering
 */
exports.getAllPredictions = async (req, res) => {
  try {
    const { category, demandLevel, sortBy = "predictedDemand" } = req.query;

    let filter = { status: "active" };

    if (category) {
      filter.category = category;
    }

    if (demandLevel) {
      filter.demandLevel = demandLevel;
    }

    const predictions = await DemandPrediction.find(filter)
      .sort({ [sortBy]: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching predictions",
      error: error.message,
    });
  }
};

/**
 * Get prediction analytics/dashboard data
 */
exports.getAnalytics = async (req, res) => {
  try {
    const predictions = await DemandPrediction.find({ status: "active" });

    if (predictions.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalProducts: 0,
          byDemandLevel: {},
          byCategory: {},
          averageConfidence: 0,
          criticalStockItems: [],
        },
      });
    }

    // Group by demand level
    const byDemandLevel = {};
    const byCategory = {};
    let totalConfidence = 0;

    predictions.forEach((p) => {
      // By demand level
      byDemandLevel[p.demandLevel] = (byDemandLevel[p.demandLevel] || 0) + 1;

      // By category
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;

      totalConfidence += p.confidenceScore || 0;
    });

    // Find critical stock items (high predicted demand)
    const criticalItems = predictions
      .filter((p) => p.demandLevel === "very-high" || p.demandLevel === "high")
      .sort((a, b) => b.predictedDemand - a.predictedDemand)
      .slice(0, 10)
      .map((p) => ({
        productName: p.productName,
        demandLevel: p.demandLevel,
        predictedDemand: p.predictedDemand,
        recommendedStock: p.recommendedStockLevel,
        confidenceScore: p.confidenceScore,
      }));

    const analytics = {
      totalProducts: predictions.length,
      byDemandLevel,
      byCategory,
      averageConfidence: totalConfidence / predictions.length,
      criticalStockItems: criticalItems,
      lastUpdated: new Date(),
    };

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};

/**
 * Update prediction status
 */
exports.updatePredictionStatus = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const { status } = req.body;

    const validStatuses = ["active", "inactive", "pending-training"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const prediction = await DemandPrediction.findByIdAndUpdate(
      predictionId,
      { status },
      { new: true },
    );

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found",
      });
    }

    return res.status(200).json({
      success: true,
      prediction,
    });
  } catch (error) {
    console.error("Error updating prediction:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating prediction",
      error: error.message,
    });
  }
};

/**
 * Helper: Train ML Model using Python
 */
function trainMLModel(trainingData, categoryStats) {
  return new Promise((resolve, reject) => {
    // Scripts live at backend root — two levels up from src/controllers/
    const backendRoot = path.join(__dirname, "../../");
    const pythonScript = path.join(backendRoot, "ml_train_wrapper.py");

    // Run Python from backend root so ml_models/ is created in the right place
    const python = spawn("python3", [pythonScript], { cwd: backendRoot });
    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.stdin.write(JSON.stringify({ trainingData, categoryStats }));
    python.stdin.end();

    python.on("close", (code) => {
      // Clear timeout
      clearTimeout(timer);

      let result;
      try {
        result = output.trim() ? JSON.parse(output.trim()) : null;
      } catch (e) {
        // Fallback for non-JSON output
      }

      if (code === 0 && result) {
        resolve(result);
      } else {
        // If we have a JSON result with an error message, use it
        if (result && result.error) {
          reject(new Error(result.error));
        } else {
          reject(new Error(`Python error (code ${code}): ${errorOutput || output || "Unknown error"}`));
        }
      }
    });

    const timer = setTimeout(() => {
      python.kill();
      reject(new Error("ML training timeout"));
    }, 300000); // 5 minutes timeout

    python.on("close", () => clearTimeout(timer));
  });
}

/**
 * Helper: Get prediction from ML using Python
 */
function getPredictionFromML(orders, category, price, discount, categoryStats) {
  return new Promise((resolve, reject) => {
    // Scripts live at backend root — two levels up from src/controllers/
    const backendRoot = path.join(__dirname, "../../");
    const pythonScript = path.join(backendRoot, "ml_predict_wrapper.py");

    // Run Python from backend root so ml_models/ is resolved correctly
    const python = spawn("python3", [pythonScript], { cwd: backendRoot });
    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    const orderData = orders.map((o) => ({
      date: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
      quantity: o.quantity,
      price: o.product?.price ? parseFloat(o.product.price) : price,
      discount_percent: o.product?.discount ? parseFloat(o.product.discount) : 0,
    }));

    python.stdin.write(
      JSON.stringify({
        orders: orderData,
        category,
        price,
        discount,
        categoryStats,
      }),
    );
    python.stdin.end();

    python.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output.trim());
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse prediction output: ${output}`));
        }
      } else {
        // Prediction wrapper returns exit code 0 even on errors with safe defaults,
        // so this branch only fires on a hard crash
        reject(new Error(`Prediction script error: ${errorOutput}`));
      }
    });

    const timer = setTimeout(() => {
      python.kill();
      reject(new Error("Prediction timeout"));
    }, 60000); // 1 minute timeout

    python.on("close", () => clearTimeout(timer));
  });
}

/**
 * Helper: Calculate monthly trend
 */
function calculateMonthlyTrend(orders) {
  const monthlyData = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { quantity: 0, orders: 0 };
    }

    monthlyData[monthKey].quantity += order.quantity;
    monthlyData[monthKey].orders += 1;
  });

  return Object.entries(monthlyData)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([month, data]) => ({
      month,
      quantity: data.quantity,
      orders: data.orders,
    }));
}

/**
 * Helper: Get category statistics
 */
async function getCategoryStatistics() {
  const categories = [
    "electricals",
    "tools",
    "paints",
    "lighting",
    "bathroom",
    "appliances",
  ];
  const stats = {};

  // Count products and their orders per category
  for (const category of categories) {
    // Find products in this category
    const products = await Product.find({ category }).select("name");
    const productNames = products.map((p) => p.name);

    let orderCount = 0;
    if (productNames.length > 0) {
      orderCount = await Order.countDocuments({
        "product.name": { $in: productNames },
      });
    }

    stats[category] = {
      avg_orders:
        products.length > 0
          ? Math.floor(orderCount / products.length)
          : 0,
    };
  }

  return stats;
}

/**
 * Helper: Calculate seasonality factor
 */
function calculateSeasonalityFactor() {
  const month = new Date().getMonth() + 1;
  const seasonalityMap = {
    1: 0.95,
    2: 0.92,
    3: 0.98,
    4: 1.0,
    5: 0.95,
    6: 0.85,
    7: 0.8,
    8: 0.9,
    9: 0.95,
    10: 1.15,
    11: 1.25,
    12: 1.3,
  };
  return seasonalityMap[month] || 1.0;
}
