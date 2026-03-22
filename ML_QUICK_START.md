# ML Demand Prediction - Quick Start Guide

## 5-Minute Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r ml_requirements.txt
```

### 2. Restart Backend Server

```bash
npm run dev
```

### 3. Access Admin Dashboard

- Go to `http://localhost:5173/admin/demand-analytics`
- You'll see an empty dashboard

### 4. Train the Model

- Click "Train Model" button
- Wait for training to complete (30-60 seconds)
- Models will be saved to `backend/ml_models/`

### 5. View Predictions

- Predictions update automatically after training
- Filter by category or demand level
- View critical stock items at the top

## API Quick Reference

### Get All Predictions

```bash
curl http://localhost:5000/api/ml/predictions
```

### Get Product Prediction

```bash
curl http://localhost:5000/api/ml/prediction/{productId}
```

### Get Analytics

```bash
curl http://localhost:5000/api/ml/analytics
```

### Train Model (requires admin token)

```bash
curl -X POST http://localhost:5000/api/ml/train \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

## File Locations

| File                                                    | Purpose                   |
| ------------------------------------------------------- | ------------------------- |
| `backend/ml_service.py`                                 | Main ML prediction engine |
| `backend/ml_train_wrapper.py`                           | Training wrapper          |
| `backend/ml_predict_wrapper.py`                         | Prediction wrapper        |
| `backend/ml_requirements.txt`                           | Python dependencies       |
| `backend/src/models/DemandPrediction.js`                | MongoDB schema            |
| `backend/src/controllers/demandPredictionController.js` | API controller            |
| `backend/src/routes/demandPredictionRoutes.js`          | API routes                |
| `frontend/src/components/DemandAnalytics.jsx`           | React dashboard           |
| `frontend/src/styles/DemandAnalytics.css`               | Dashboard styles          |

## How It Works

1. **Data Collection**: Gathers all completed orders
2. **Feature Engineering**: Extracts patterns and trends
3. **Model Training**: Uses machine learning (Random Forest + Gradient Boosting)
4. **Predictions**: Predicts demand for each product
5. **Display**: Shows results in admin dashboard with visual analytics

## Demand Levels Explained

| Level     | Meaning               | Threshold |
| --------- | --------------------- | --------- |
| Low       | <5 units predicted    | ≤ 5       |
| Medium    | 5-15 units predicted  | 5-15      |
| High      | 15-30 units predicted | 15-30     |
| Very High | >30 units predicted   | >30       |

## Troubleshooting

**Q: I see "Model not yet trained" errors**

- A: Click "Train Model" in the dashboard first

**Q: Python command not found**

- A: Ensure Python 3 is installed: `python3 --version`

**Q: No predictions showing**

- A: You need at least some delivered orders to train on

**Q: Timeout during training**

- A: Normal for large datasets. May take 60-120 seconds

## Next Steps

1. Train the model with your order history
2. Review critical stock items
3. Use predictions for inventory planning
4. Retrain weekly with new order data
5. Monitor accuracy and adjust as needed

## Advanced Usage

### Retrain Regularly

Add to cron job or scheduler:

```bash
curl -X POST http://localhost:5000/api/ml/train \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json"
```

### Export Predictions

```bash
curl http://localhost:5000/api/ml/predictions?limit=1000 > predictions.json
```

### Monitor Performance

Check the average confidence score in analytics dashboard. If below 0.70, retrain or collect more order data.

---

See [ML_SETUP_GUIDE.md](./ML_SETUP_GUIDE.md) for detailed documentation.
