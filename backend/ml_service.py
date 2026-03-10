"""
Demand Prediction ML Module
Predicts product demand based on historical order data using machine learning
"""

import json
import numpy as np
from datetime import datetime, timedelta
from calendar import monthrange
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.exceptions import NotFittedError
from sklearn.utils.validation import check_is_fitted
import joblib
import os

class DemandPredictor:
    """Machine Learning model for predicting product demand"""
    
    def __init__(self, model_dir='ml_models'):
        self.model_dir = model_dir
        self.rf_model = None
        self.average_model = None  # GradientBoosting — None until loaded/trained
        self.scaler = StandardScaler()
        self.feature_names = [
            'total_orders', 'avg_quantity', 'price', 'discount_percent',
            'month_of_year', 'day_of_month', 'previous_month_orders',
            'seasonality_index', 'category_popularity'
        ]
        
        # Create model directory if it doesn't exist
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
    
    def _is_models_ready(self):
        """Return True only when both models are fitted and scaler is ready."""
        if self.rf_model is None or self.average_model is None:
            return False
        try:
            check_is_fitted(self.rf_model)
            check_is_fitted(self.average_model)
            check_is_fitted(self.scaler)
            return True
        except NotFittedError:
            return False
    
    def preprocess_order_history(self, orders, product_category, all_categories_stats=None):
        """
        Convert order history to feature matrix
        
        Args:
            orders: List of order dictionaries with date, quantity, price
            product_category: Category of the product
            all_categories_stats: Statistics for all categories for normalization
            
        Returns:
            X: Feature matrix
            y: Demand targets (quantity)
        """
        if not orders:
            return np.array([]), np.array([])
        
        X = []
        y = []
        
        # Calculate historical metrics
        total_orders = len(orders)
        quantities = [float(order.get('quantity', 1)) for order in orders]
        avg_quantity = np.mean(quantities) if quantities else 1
        total_quantity = sum(quantities)
        
        # Get price from first order (assuming consistent pricing)
        price = float(orders[0].get('price', 0)) if orders else 0
        discount = float(orders[0].get('discount_percent', 0)) if orders else 0
        
        # Category popularity
        category_popularity = all_categories_stats.get(product_category, {}).get('avg_orders', 1) if all_categories_stats else 1
        
        # Process orders chronologically to create time-series features
        sorted_orders = sorted(orders, key=lambda x: x.get('date', datetime.now()))
        
        monthly_data = {}
        
        for order in sorted_orders:
            try:
                order_date = datetime.fromisoformat(order.get('date', datetime.now().isoformat()))
            except:
                order_date = datetime.now()
            
            month_key = order_date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {'quantity': 0, 'count': 0}
            
            monthly_data[month_key]['quantity'] += float(order.get('quantity', 1))
            monthly_data[month_key]['count'] += 1
        
        # Generate features for each order (creating training samples)
        previous_month_quantity = 0
        
        for idx, order in enumerate(sorted_orders):
            try:
                order_date = datetime.fromisoformat(order.get('date', datetime.now().isoformat()))
            except:
                order_date = datetime.now()
            
            month_of_year = order_date.month
            day_of_month = order_date.day
            quantity = float(order.get('quantity', 1))
            
            # Seasonality: estimate based on month (simple heuristic)
            # Adjust based on your domain knowledge
            seasonality_index = self._calculate_seasonality(month_of_year)
            
            # Previous month orders
            prev_month = (order_date.replace(day=1) - timedelta(days=1)).strftime('%Y-%m')
            prev_month_orders = monthly_data.get(prev_month, {}).get('count', 0)
            
            features = [
                total_orders,
                avg_quantity,
                price / 100.0 if price > 0 else 0,  # Normalize
                discount / 100.0 if discount > 0 else 0,
                month_of_year / 12.0,
                day_of_month / 31.0,
                prev_month_orders / max(total_orders, 1),
                seasonality_index,
                category_popularity / 100.0
            ]
            
            X.append(features)
            y.append(quantity)
        
        if not X or not y:
            return np.array([]), np.array([])
        
        return np.array(X), np.array(y)
    
    def _calculate_seasonality(self, month):
        """
        Calculate seasonality index for a given month
        Months 10-12 (Oct-Dec) have higher demand, 6-7 (Jun-Jul) lower
        Adjust these factors based on your business data
        """
        seasonality_map = {
            1: 0.95, 2: 0.92, 3: 0.98, 4: 1.00, 5: 0.95,
            6: 0.85, 7: 0.80, 8: 0.90, 9: 0.95, 10: 1.15,
            11: 1.25, 12: 1.30
        }
        return seasonality_map.get(month, 1.0)
    
    def train(self, order_history_list, product_metadata):
        """
        Train models on aggregated order history
        
        Args:
            order_history_list: List of [orders, category, price, discount] tuples
            product_metadata: Dict with category statistics
            
        Returns:
            Training results with accuracy metrics
        """
        X_all = []
        y_all = []
        
        for orders, category, price, discount in order_history_list:
            X, y = self.preprocess_order_history(
                orders, 
                category, 
                product_metadata
            )
            if len(X) > 0:
                X_all.extend(X)
                y_all.extend(y)
        
        if len(X_all) == 0:
            return {'error': 'Insufficient training data', 'success': False}
        
        X_all = np.array(X_all)
        y_all = np.array(y_all)
        
        if len(X_all) < 10:
            # Not enough data for a robust split, train on everything
            X_train = X_all
            y_train = y_all
            X_test = X_all
            y_test = y_all
        else:
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_all, y_all, test_size=0.2, random_state=42
            )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.rf_model.fit(X_train_scaled, y_train)
        rf_score = self.rf_model.score(X_test_scaled, y_test)
        
        # Train Gradient Boosting
        self.average_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.average_model.fit(X_train_scaled, y_train)
        gb_score = self.average_model.score(X_test_scaled, y_test)
        
        # Save models
        self._save_models()
        
        return {
            'success': True,
            'random_forest_accuracy': float(max(0, rf_score)),  # Ensure non-negative
            'gradient_boosting_accuracy': float(max(0, gb_score)),
            'average_accuracy': float(max(0, (rf_score + gb_score) / 2)),
            'training_samples': len(X_all),
            'test_samples': len(X_test),
            'trained_at': datetime.now().isoformat()
        }
    
    def predict(self, orders, category, price, discount, all_categories_stats=None):
        """
        Predict demand for a specific product
        """
        # Load saved models if they are not yet ready
        if not self._is_models_ready():
            loaded = self._load_models()
            if not loaded or not self._is_models_ready():
                raise RuntimeError("No trained model found. Train the model first.")
        
        # Prepare features
        total_orders = len(orders) if orders else 0
        quantities = [float(o.get('quantity', 1)) for o in orders] if orders else [1]
        avg_quantity = np.mean(quantities)
        
        category_popularity = all_categories_stats.get(category, {}).get('avg_orders', 1) if all_categories_stats else 1
        
        # Get current date features
        now = datetime.now()
        month_of_year = now.month
        day_of_month = now.day
        seasonality_index = self._calculate_seasonality(month_of_year)
        
        # Calculate previous month orders
        prev_month = (now.replace(day=1) - timedelta(days=1)).strftime('%Y-%m')
        sorted_orders = sorted(orders if orders else [], key=lambda x: x.get('date', now))
        monthly_data = {}
        
        for order in sorted_orders:
            try:
                order_date = datetime.fromisoformat(order.get('date', now.isoformat()))
            except:
                order_date = now
            month_key = order_date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {'count': 0}
            monthly_data[month_key]['count'] += 1
        
        prev_month_orders = monthly_data.get(prev_month, {}).get('count', 0)
        
        # Build feature vector
        features = np.array([[
            total_orders,
            avg_quantity,
            price / 100.0 if price > 0 else 0,
            discount / 100.0 if discount > 0 else 0,
            month_of_year / 12.0,
            day_of_month / 31.0,
            prev_month_orders / max(total_orders, 1),
            seasonality_index,
            category_popularity / 100.0
        ]])
        
        try:
            features_scaled = self.scaler.transform(features)
        except NotFittedError:
            raise RuntimeError("Scaler not fitted. Train the model first.")
        
        # Get predictions from both models
        rf_prediction = self.rf_model.predict(features_scaled)[0]
        gb_prediction = self.average_model.predict(features_scaled)[0]
        
        # Ensemble prediction (average)
        predicted_demand = (rf_prediction + gb_prediction) / 2
        predicted_demand = max(1, predicted_demand)  # Ensure at least 1
        
        # Determine demand level
        if predicted_demand < 5:
            demand_level = 'low'
            confidence = 0.7
        elif predicted_demand < 15:
            demand_level = 'medium'
            confidence = 0.75
        elif predicted_demand < 30:
            demand_level = 'high'
            confidence = 0.8
        else:
            demand_level = 'very-high'
            confidence = 0.85
        
        # Trending direction
        if len(quantities) >= 2:
            trend = np.polyfit(range(len(quantities)), quantities, 1)[0]
            if trend > 1:
                trending_direction = 'increasing'
            elif trend < -1:
                trending_direction = 'decreasing'
            else:
                trending_direction = 'stable'
        else:
            trending_direction = 'stable'
        
        # Recommended stock level (buffer for safety)
        recommended_stock = int(predicted_demand * 1.5)
        
        return {
            'predicted_demand': float(predicted_demand),
            'demand_level': demand_level,
            'confidence_score': confidence,
            'trending_direction': trending_direction,
            'recommended_stock_level': recommended_stock,
            'rf_prediction': float(rf_prediction),
            'gb_prediction': float(gb_prediction),
            'historical_avg': float(avg_quantity),
            'total_historical_orders': total_orders
        }
    
    def _save_models(self):
        """Save trained models to disk"""
        if self.rf_model:
            joblib.dump(self.rf_model, os.path.join(self.model_dir, 'rf_model.pkl'))
        if self.average_model:
            joblib.dump(self.average_model, os.path.join(self.model_dir, 'gb_model.pkl'))
        joblib.dump(self.scaler, os.path.join(self.model_dir, 'scaler.pkl'))
    
    def _load_models(self):
        """Load trained models from disk. Returns True on success, False if not found."""
        rf_path = os.path.join(self.model_dir, 'rf_model.pkl')
        gb_path = os.path.join(self.model_dir, 'gb_model.pkl')
        scaler_path = os.path.join(self.model_dir, 'scaler.pkl')
        
        if not (os.path.exists(rf_path) and os.path.exists(gb_path) and os.path.exists(scaler_path)):
            return False
        
        try:
            self.rf_model = joblib.load(rf_path)
            self.average_model = joblib.load(gb_path)
            self.scaler = joblib.load(scaler_path)
            return True
        except Exception as e:
            # Corrupted model files — signal caller to retrain
            print(f"Warning: Failed to load models: {e}", flush=True)
            return False
    
    def get_monthly_trend(self, orders):
        """
        Extract monthly trend from order history
        
        Returns:
            List of monthly statistics
        """
        if not orders:
            return []
        
        monthly_stats = {}
        
        for order in orders:
            try:
                order_date = datetime.fromisoformat(order.get('date', datetime.now().isoformat()))
            except:
                order_date = datetime.now()
            
            month_key = order_date.strftime('%B %Y')
            quantity = float(order.get('quantity', 1))
            
            if month_key not in monthly_stats:
                monthly_stats[month_key] = {'quantity': 0, 'orders': 0}
            
            monthly_stats[month_key]['quantity'] += quantity
            monthly_stats[month_key]['orders'] += 1
        
        # Sort by date and format
        trend = []
        for month_str, stats in sorted(monthly_stats.items()):
            trend.append({
                'month': month_str,
                'quantity': stats['quantity'],
                'orders': stats['orders'],
                'avg_per_order': stats['quantity'] / stats['orders']
            })
        
        return trend


def create_predictor(model_dir='ml_models'):
    """Factory function to create a DemandPredictor instance"""
    return DemandPredictor(model_dir)
