import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DemandAnalytics.css';

const DemandAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [training, setTraining] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDemandLevel, setSelectedDemandLevel] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const API_BASE = `${import.meta.env.VITE_PROD_URL}/api`;

    useEffect(() => {
        fetchAnalytics();
        fetchPredictions();
    }, [selectedCategory, selectedDemandLevel]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${API_BASE}/ml/analytics`);
            setAnalytics(response.data.analytics);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to fetch analytics');
        }
    };

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            let url = `${API_BASE}/ml/predictions`;
            const params = new URLSearchParams();

            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedDemandLevel) params.append('demandLevel', selectedDemandLevel);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);
            setPredictions(response.data.predictions || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching predictions:', err);
            setError('Failed to fetch predictions');
            setPredictions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTrainModel = async () => {
        try {
            setTraining(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE}/ml/train`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSuccessMessage('Model training completed successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);

            // Refresh data
            await fetchAnalytics();
            await fetchPredictions();
        } catch (err) {
            console.error('Error training model:', err);
            setError(err.response?.data?.message || 'Failed to train model');
        } finally {
            setTraining(false);
        }
    };

    const getDemandColor = (level) => {
        switch (level) {
            case 'very-high':
                return '#d32f2f';
            case 'high':
                return '#f57c00';
            case 'medium':
                return '#fbc02d';
            case 'low':
                return '#388e3c';
            default:
                return '#999';
        }
    };

    const getDemandLabel = (level) => {
        if (!level) return 'UNKNOWN';
        return level.replace('-', ' ').toUpperCase();
    };

    return (
        <div className="demand-analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <h1>Demand Analytics Dashboard</h1>
                <p>ML-powered product demand predictions based on historical order data</p>
            </div>

            {/* Alert Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Summary Cards */}
            {analytics && (
                <div className="summary-cards">
                    <div className="card summary-card">
                        <div className="card-value">{analytics.totalProducts}</div>
                        <div className="card-label">Products Analyzed</div>
                    </div>

                    <div className="card summary-card">
                        <div className="card-value">{anomalyCount(analytics.byDemandLevel)}</div>
                        <div className="card-label">High Demand Items</div>
                        <div className="card-subtitle">very-high + high</div>
                    </div>

                    <div className="card summary-card">
                        <div className="card-value">{(analytics.averageConfidence * 100).toFixed(1)}%</div>
                        <div className="card-label">Avg Confidence</div>
                    </div>

                    <div className="card summary-card">
                        <div className="card-value">{Object.keys(analytics.byCategory || {}).length}</div>
                        <div className="card-label">Categories</div>
                    </div>
                </div>
            )}

            {/* Demand Level Distribution */}
            {analytics && (
                <div className="analytics-grid">
                    <div className="card">
                        <h3>Demand Level Distribution</h3>
                        <div className="demand-distribution">
                            {Object.entries(analytics.byDemandLevel).map(([level, count]) => (
                                <div key={level} className="distribution-item">
                                    <div className="distribution-header">
                                        <span className="level-badge" style={{ backgroundColor: getDemandColor(level) }}>
                                            {getDemandLabel(level)}
                                        </span>
                                        <span className="count">{count}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(count / (analytics.totalProducts || 1)) * 100}%`,
                                                backgroundColor: getDemandColor(level)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="card">
                        <h3>Distribution by Category</h3>
                        <div className="category-list">
                            {Object.entries(analytics.byCategory || {}).map(([category, count]) => (
                                <div key={category} className="category-item">
                                    <span className="category-name">{category.toUpperCase()}</span>
                                    <span className="category-count">{count} products</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Critical Stock Items */}
            {analytics?.criticalStockItems && analytics.criticalStockItems.length > 0 && (
                <div className="card">
                    <h3>⚠️ Critical Stock Items</h3>
                    <div className="critical-items">
                        {analytics.criticalStockItems.map((item, idx) => (
                            <div key={idx} className="critical-item">
                                <div className="item-info">
                                    <h4>{item.productName}</h4>
                                    <p className="item-details">
                                        Predicted Demand: <strong>{Math.round(item.predictedDemand)} units</strong> |
                                        Recommended Stock: <strong>{item.recommendedStock} units</strong> |
                                        Confidence: <strong>{(item.confidenceScore * 100).toFixed(1)}%</strong>
                                    </p>
                                </div>
                                <div className="demand-badge" style={{ backgroundColor: getDemandColor(item.demandLevel) }}>
                                    {getDemandLabel(item.demandLevel)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters & Controls */}
            <div className="card filters-section">
                <h3>Predictions</h3>
                <div className="filters">
                    <div className="filter-group">
                        <label>Category:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="electricals">Electricals</option>
                            <option value="tools">Tools</option>
                            <option value="paints">Paints</option>
                            <option value="lighting">Lighting</option>
                            <option value="bathroom">Bathroom</option>
                            <option value="appliances">Appliances</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Demand Level:</label>
                        <select value={selectedDemandLevel} onChange={(e) => setSelectedDemandLevel(e.target.value)}>
                            <option value="">All Levels</option>
                            <option value="very-high">Very High</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleTrainModel}
                        disabled={training}
                    >
                        {training ? 'Training...' : 'Train Model'}
                    </button>
                </div>
            </div>

            {/* Predictions Table */}
            <div className="card">
                <h3>Product Demand Predictions ({predictions.length})</h3>
                {loading ? (
                    <div className="loader">Loading predictions...</div>
                ) : predictions.length === 0 ? (
                    <div className="empty-state">
                        <p>No predictions found. Try adjusting filters or train the model.</p>
                    </div>
                ) : (
                    <div className="predictions-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Predicted Demand</th>
                                    <th>Demand Level</th>
                                    <th>Confidence</th>
                                    <th>Trending</th>
                                    <th>Stock Level</th>
                                    <th>Historical Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictions.map((pred) => (
                                    <tr key={pred._id} className={`demand-${pred.demandLevel}`}>
                                        <td className="product-name">{pred.productName}</td>
                                        <td>{pred.category}</td>
                                        <td className="demand-value">{Math.round(pred.predictedDemand)} units</td>
                                        <td>
                                            <span
                                                className="demand-badge"
                                                style={{ backgroundColor: getDemandColor(pred.demandLevel) }}
                                            >
                                                {getDemandLabel(pred.demandLevel)}
                                            </span>
                                        </td>
                                        <td>{(pred.confidenceScore * 100).toFixed(1)}%</td>
                                        <td>
                                            <span className={`trend-badge trend-${pred.trendingDirection || 'stable'}`}>
                                                {(pred.trendingDirection || 'stable').toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{pred.recommendedStockLevel} units</td>
                                        <td>{pred.totalOrders}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper function to count high demand items
function anomalyCount(demandLevels) {
    return (demandLevels?.['very-high'] || 0) + (demandLevels?.['high'] || 0);
}

export default DemandAnalytics;
