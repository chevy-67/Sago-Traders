import React from 'react';
import '../styles/ProductListPage.css'; // We'll put card styles here for now or separate if needed

const ProductCard = ({ product }) => {
    return (
        <div className="deal-card">
            <div className="off-badge">{product.off || product.discount + '%'} Offer</div>
            <img src={product.image} alt={product.name} className="product-img" />

            <div className="product-info">
                <h4>{product.name}</h4>
                <div className="pricing">
                    <span className="current-price">₹{product.price}</span>
                    <span className="original-price">₹{product.originalPrice}</span>
                    <span className="gst-label">Inclu. GST</span>
                </div>
                <div className="btn-group">
                    <button className="book-now">BOOK NOW</button>
                    <button className="add-cart">ADD TO CART</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
