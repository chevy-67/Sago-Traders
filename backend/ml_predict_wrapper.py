#!/usr/bin/env python3
"""
ML Prediction Wrapper - Called from Node.js backend
Generates demand predictions for a specific product
"""

import sys
import json
from ml_service import create_predictor

def main():
    try:
        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        orders = data.get('orders', [])
        category = data.get('category', '')
        price = data.get('price', 0)
        discount = data.get('discount', 0)
        category_stats = data.get('categoryStats', {})
        
        # Create predictor
        predictor = create_predictor()
        
        # Try to generate prediction
        # If no trained model exists, use heuristic-based prediction
        try:
            result = predictor.predict(orders, category, price, discount, category_stats)
        except Exception as predict_error:
            # Fallback to simple heuristic if model is not trained
            if orders:
                quantities = [float(o.get('quantity', 1)) for o in orders]
                avg_qty = sum(quantities) / len(quantities)
                predicted_demand = avg_qty * 1.2  # 20% increase for demand
                confidence = 0.6
            else:
                predicted_demand = 5
                confidence = 0.3
            
            result = {
                'predicted_demand': predicted_demand,
                'demand_level': 'medium',
                'confidence_score': confidence,
                'trending_direction': 'stable',
                'recommended_stock_level': int(predicted_demand * 1.5),
                'historical_avg': sum([float(o.get('quantity', 1)) for o in orders]) / len(orders) if orders else 0,
                'total_historical_orders': len(orders),
                'note': 'Using heuristic prediction - model not yet trained'
            }
        
        # Output result as JSON
        print(json.dumps(result, default=str))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e),
            'predicted_demand': 5,
            'demand_level': 'low',
            'confidence_score': 0.3,
            'trending_direction': 'stable',
            'recommended_stock_level': 8
        }
        print(json.dumps(error_result))
        sys.exit(0)  # Exit gracefully but return safe defaults

if __name__ == '__main__':
    main()
