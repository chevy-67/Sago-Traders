# Machine Learning Demand Prediction - Setup Guide

## Overview

This document explains how to set up and use the new ML-powered demand prediction feature that predicts product demand based on historical order data.

## Architecture

The ML feature integrates:

- **Backend**: Node.js/Express API endpoints for ML operations
- **ML Service**: Python module using scikit-learn for model training and predictions
- **Database**: MongoDB collection for storing predictions
- **Frontend**: React admin dashboard for visualization and model management

## Database Setup

### 1. New MongoDB Collection: DemandPrediction

The system automatically creates the `DemandPrediction` collection when first prediction is made. Schema includes:

```javascript
{
  productId: ObjectId,           // Reference to Product
  productName: String,           // Product name
  category: String,              // Product category
  totalOrders: Number,           // Historical order count
  averageOrderQuantity: Number,  // Average quantity per order
  totalQuantitySold: Number,     // Total quantity sold
  predictedDemand: Number,       // ML predicted demand
  demandLevel: String,           // 'low', 'medium', 'high', 'very-high'
  confidenceScore: Number,       // 0-1 confidence
  trendingDirection: String,     // 'increasing', 'decreasing', 'stable'
  monthlyTrend: Array,          // Historical monthly data
  recommendedStockLevel: Number, // Suggested inventory
  status: String,                // 'active', 'inactive', 'pending-training'
  // ... additional fields
}
```

## Backend Setup

### 1. Install Python Dependencies

In the backend directory, install required Python packages:

```bash
cd backend
pip install -r ml_requirements.txt
```

Required packages:

- `scikit-learn==1.3.2` - Machine learning library
- `numpy==1.24.3` - Numerical computing
- `joblib==1.3.2` - Model serialization

### 2. Environment Configuration

Add to your `.env` file:

```env
# ML Configuration
ML_MODEL_DIR=./ml_models
PYTHON_PATH=/usr/bin/python3
```

### 3. Files Created

- **`/ml_service.py`** - Main ML module with `DemandPredictor` class
- **`/ml_train_wrapper.py`** - Python wrapper for model training
- **`/ml_predict_wrapper.py`** - Python wrapper for predictions
- **`/src/controllers/demandPredictionController.js`** - API controller
- **`/src/routes/demandPredictionRoutes.js`** - API routes
- **`/src/models/DemandPrediction.js`** - MongoDB model

## API Endpoints

### 1. Train Model

```
POST /api/ml/train
Authorization: Required (Admin)

Body: (empty)

Response:
{
  "success": true,
  "result": {
    "random_forest_accuracy": 0.85,
    "gradient_boosting_accuracy": 0.87,
    "average_accuracy": 0.86,
    "training_samples": 150,
    "trained_at": "2024-03-17T10:30:00Z"
  }
}
```

### 2. Get Product Prediction

```
GET /api/ml/prediction/:productId

Response:
{
  "success": true,
  "prediction": {
    "productId": "...",
    "productName": "LED Bulb",
    "predictedDemand": 25.5,
    "demandLevel": "high",
    "confidenceScore": 0.82,
    "trendingDirection": "increasing",
    "recommendedStockLevel": 38,
    "totalOrders": 45
  }
}
```

### 3. Get All Predictions

```
GET /api/ml/predictions?category=electricals&demandLevel=high&sortBy=predictedDemand

Query Parameters:
- category: Filter by category (electricals, tools, paints, etc.)
- demandLevel: Filter by demand level (low, medium, high, very-high)
- sortBy: Sort field (default: predictedDemand)

Response:
{
  "success": true,
  "count": 45,
  "predictions": [...]
}
```

### 4. Get Analytics Dashboard Data

```
GET /api/ml/analytics

Response:
{
  "success": true,
  "analytics": {
    "totalProducts": 150,
    "byDemandLevel": {
      "very-high": 12,
      "high": 35,
      "medium": 78,
      "low": 25
    },
    "byCategory": {
      "electricals": 45,
      "tools": 30,
      ...
    },
    "averageConfidence": 0.81,
    "criticalStockItems": [...]
  }
}
```

### 5. Update Prediction Status

```
PATCH /api/ml/prediction/:predictionId/status
Authorization: Required (Admin)

Body:
{
  "status": "inactive"  // or "active", "pending-training"
}
```

## Frontend Setup

### 1. Component Files

- **`/src/components/DemandAnalytics.jsx`** - Main admin dashboard component
- **`/src/styles/DemandAnalytics.css`** - Styling

### 2. Navigation Integration

The DemandAnalytics component is automatically integrated into the admin dashboard with a "Demand Analytics" link in the sidebar.

### 3. Route

```javascript
// In App.jsx
<Route path="demand-analytics" element={<DemandAnalytics />} />
```

## How It Works

### 1. Model Training Process

1. **Data Collection**: Gathers all delivered orders from database
2. **Feature Engineering**: Extracts features like:
   - Order quantity and frequency
   - Seasonality factors
   - Historical trends
   - Category popularity
3. **Model Training**: Uses ensemble of Random Forest and Gradient Boosting models
4. **Model Persistence**: Saves trained models to disk using joblib

### 2. Prediction Process

1. **Feature Extraction**: Prepares features for a specific product
2. **Prediction**: Both models make predictions
3. **Ensemble**: Averages predictions for better accuracy
4. **Demand Classification**: Categorizes into demand levels
5. **Stock Recommendation**: Calculates recommended inventory level

### 3. Seasonality Factor

The system includes built-in seasonality adjustments:

- Oct-Dec: +15-30% (higher demand)
- Jun-Jul: -15-20% (lower demand)
- Other months: baseline

Adjust in `ml_service.py` `_calculate_seasonality()` method based on your data.

## Usage Guide

### For Admin Users:

1. **View Dashboard**
   - Navigate to "Demand Analytics" in admin sidebar
   - See summary of all products and their demand levels

2. **Train Model**
   - Click "Train Model" button
   - System trains on all delivered orders
   - Wait for completion (usually 30-60 seconds)

3. **Filter Predictions**
   - Filter by category or demand level
   - Sort by predicted demand
   - View detailed metrics

4. **Critical Items**
   - See products with highest predicted demand
   - Use for inventory planning

### For Developers:

1. **Custom Training**

   ```javascript
   const predictor = require("./ml_service").create_predictor();
   // Train with custom data
   ```

2. **Retraining Schedule**
   - Call `/api/ml/train` endpoint periodically (weekly recommended)
   - Updates model with latest order data

3. **Model Accuracy**
   - Monitor `averageConfidence` score
   - Monitor model accuracy metrics
   - Retrain if accuracy drops below 0.70

## Troubleshooting

### Issue: Python not found error

**Solution**: Ensure Python 3 is installed and in PATH

```bash
which python3
# Should return: /usr/bin/python3 or similar
```

### Issue: ML module import errors

**Solution**: Verify dependencies are installed

```bash
pip list | grep -E "scikit-learn|numpy|joblib"
```

### Issue: Model training timeout

**Solution**:

- Reduce number of training samples
- Increase timeout in `demandPredictionController.js`
- Check for large order dataset

### Issue: Low prediction confidence

**Solution**:

- Ensure sufficient historical data (minimum 20-30 orders per product)
- Retrain model with latest data
- Check for data quality issues

## Performance Considerations

### Training

- **Time**: Scales with number of orders (typical: 30-60s for 5000+ orders)
- **Memory**: ~500MB for 10,000 orders
- **Disk**: ~5-10MB for trained models

### Predictions

- **Time**: ~100-200ms per product
- **Memory**: ~50-100MB runtime

### Optimization Tips

1. Cache predictions for 6-12 hours
2. Train models during off-peak hours
3. Use pagination for large result sets
4. Archive old order data to separate database

## Advanced Configuration

### Modify Seasonality (in ml_service.py)

```python
def _calculate_seasonality(self, month):
    seasonality_map = {
        1: 0.95,  # January - 5% lower
        # ... adjust values based on your data
        12: 1.30  # December - 30% higher
    }
```

### Adjust Demand Thresholds (in demandPredictionController.js)

```javascript
if (predicted_demand < 5) demand_level = "low";
else if (predicted_demand < 15) demand_level = "medium";
// ... modify thresholds
```

### Change Model Hyperparameters (in ml_service.py)

```python
self.rf_model = RandomForestRegressor(
    n_estimators=150,  # Increase for better accuracy
    max_depth=15,
    random_state=42
)
```

## Monitoring

### Key Metrics to Monitor

1. **Model Accuracy**: Check training results
2. **Prediction Confidence**: Average confidence score
3. **Data Quality**: Orders per category, average quantity
4. **Demand Levels**: Distribution of products by demand

### Regular Maintenance

- **Weekly**: Check prediction accuracy against actual sales
- **Monthly**: Retrain model with latest data
- **Quarterly**: Review and adjust seasonality factors

## Integration with Existing Features

The ML feature integrates with:

- **Orders**: Uses delivered orders for training
- **Products**: Links predictions to product data
- **Categories**: Groups analysis by category
- **Admin Dashboard**: Displays via new component

## Future Enhancements

Potential improvements:

1. Time-series forecasting (ARIMA, Prophet)
2. Customer segmentation for personalized predictions
3. External factors (weather, holidays, marketing campaigns)
4. Real-time prediction updates
5. Automated alerts for stock level warnings
6. A/B testing for recommendation strategies

## Support

For issues or questions:

1. Check logs: `tail -f backend/ml_models/*.log`
2. Verify API connectivity
3. Check MongoDB connection
4. Ensure Python dependencies are installed
5. Review error messages in browser console

---

**Version**: 1.0  
**Last Updated**: March 2024
