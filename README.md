# Sago-Traders

Web application for Sago Traders (Pvt. Ltd)

## Features

- 🛍️ **E-Commerce Platform** - Product catalog, shopping cart, and checkout
- 👤 **User Management** - Registration, login, and user profiles
- 📦 **Order Management** - Track and manage customer orders
- 🎨 **Admin Dashboard** - Manage products, categories, banners, and orders
- 🤖 **ML Demand Prediction** - AI-powered product demand forecasting (NEW)

## New: Machine Learning Demand Prediction

This project now includes an intelligent demand prediction system that uses machine learning to forecast product demand based on historical order data.

### Key Features

- 📊 Analyzes historical order patterns
- 🎯 Predicts product demand levels (low, medium, high, very-high)
- 📈 Identifies trending products (increasing, decreasing, stable)
- 💡 Recommends optimal stock levels
- 🎨 Interactive admin dashboard with analytics

### Quick Start for ML Feature

1. **Install Python Dependencies**

   ```bash
   cd backend
   pip install -r ml_requirements.txt
   ```

2. **Train the Model**
   - Navigate to Admin Dashboard → Demand Analytics
   - Click "Train Model" button
   - Wait for training to complete

3. **View Predictions**
   - See demand forecasts for all products
   - Filter by category or demand level
   - Review critical stock items

For detailed setup and usage, see:

- [ML Quick Start Guide](./ML_QUICK_START.md) - 5-minute setup
- [ML Complete Setup Guide](./ML_SETUP_GUIDE.md) - Detailed documentation

## Tech Stack

### Frontend

- React 18 with Vite
- React Router for navigation
- Axios for API calls
- CSS3 for styling

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Python with scikit-learn for ML

### Machine Learning

- scikit-learn - Random Forest & Gradient Boosting
- NumPy - Numerical computing
- joblib - Model serialization

## Project Structure

```
Sago-Traders/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
├── backend/           # Node.js/Express server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── ml_service.py           # ML prediction engine
│   ├── ml_train_wrapper.py     # Training wrapper
│   ├── ml_predict_wrapper.py   # Prediction wrapper
│   ├── ml_requirements.txt     # Python dependencies
│   └── package.json
├── ML_QUICK_START.md
├── ML_SETUP_GUIDE.md
└── README.md
```

## Environment Setup

### Backend Environment Variables (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=5000
JWT_SECRET=your_jwt_secret_key
ML_MODEL_DIR=./ml_models
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation & Running

### Backend Setup

```bash
cd backend
npm install
npm run dev          # Development mode
npm start            # Production mode
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Vite dev server
npm run build        # Build for production
```

## API Endpoints

### ML Prediction Endpoints

- `POST /api/ml/train` - Train demand prediction model
- `GET /api/ml/prediction/:productId` - Get prediction for a product
- `GET /api/ml/predictions` - Get all predictions with filters
- `GET /api/ml/analytics` - Get analytics dashboard data
- `PATCH /api/ml/prediction/:predictionId/status` - Update prediction status

### Other Endpoints

- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Banners: `/api/banners/*`

## Admin Dashboard

Access at: `http://localhost:5173/admin`

### Pages

- **Dashboard Overview** - System statistics
- **Product Specs** - Manage product catalog
- **Hero Banners** - Manage promotional banners
- **Orders Management** - Track and manage orders
- **Demand Analytics** - View ML predictions (NEW)

## Additional Notes

- The ML model requires delivered orders to train. Ensure you have order history before training.
- Model training typically takes 30-60 seconds for datasets with 1000+ orders.
- Predictions are updated each time the model is trained.
- For development, enable CORS for both http://localhost and http://127.0.0.1 with any port (5173, 5174, etc.)

## Contributing

See project guidelines and coding standards for contributions.

## License

ISC

## Support

For issues, questions, or feature requests related to the ML feature, refer to [ML_SETUP_GUIDE.md](./ML_SETUP_GUIDE.md)
