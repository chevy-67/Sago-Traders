import React from 'react';
import '../styles/ProductListPage.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAction = (action) => {
        if (!user) {
            alert('Please login to continue');
            navigate('/login');
            return;
        }

        if (action === 'cart') {
            addToCart(product);
        } else if (action === 'book') {
            // Handle book now logic or redirect to booking page
            console.log('Book now:', product);
        }
    };

    return (
        <div className="deal-card">
            {(product.off || product.discount) && (
                <div className="off-badge">{product.off || product.discount + '%'} Offer</div>
            )}
            {product.image
                ? <img src={product.image} alt={product.name} className="product-img" />
                : <div className="product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontSize: '48px' }}>📦</div>
            }

            <div className="product-info">
                <h4>{product.name}</h4>
                <div className="pricing">
                    {product.price != null && (
                        <span className="current-price">₹{product.price}</span>
                    )}
                    {product.originalPrice != null && (
                        <span className="original-price">₹{product.originalPrice}</span>
                    )}
                    {product.price != null && <span className="gst-label">Inclu. GST</span>}
                </div>
                <div className="btn-group">
                    <button className="book-now" onClick={() => handleAction('book')}>BOOK NOW</button>
                    <button className="add-cart" onClick={() => handleAction('cart')}>ADD TO CART</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
