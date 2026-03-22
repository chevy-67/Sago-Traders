#!/usr/bin/env python3
"""
ML Training Wrapper - Called from Node.js backend
Trains the demand prediction model on aggregated order data
"""

import sys
import json
from ml_service import create_predictor

def main():
    try:
        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        training_data = data.get('trainingData', [])
        category_stats = data.get('categoryStats', {})
        
        if not training_data:
            result = {
                'success': False,
                'error': 'No training data provided'
            }
        else:
            # Create predictor and train
            predictor = create_predictor()
            
            # Prepare data in the format expected by the model
            order_history_list = [
                (item['orders'], item['category'], item['price'], item['discount'])
                for item in training_data
            ]
            
            # Train the model
            result = predictor.train(order_history_list, category_stats)
        
        # Output result as JSON
        print(json.dumps(result, default=str))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(0)

if __name__ == '__main__':
    main()
