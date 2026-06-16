import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const addToCartHandler = (e) => {
    e.preventDefault(); // Prevent navigating to product detail page if they click the button
    if (product.countInStock > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image" 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
          }}
        />
      </Link>
      
      <div className="product-details">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <div className="product-rating">
          <span className="rating-stars">
            {'★'.repeat(Math.round(product.rating || 0))}
            {'☆'.repeat(5 - Math.round(product.rating || 0))}
          </span>
          <span>{product.numReviews} reviews</span>
        </div>
        
        <div className="product-bottom">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <button 
            className="btn-primary" 
            onClick={addToCartHandler}
            disabled={product.countInStock === 0 || added}
            style={{ 
              backgroundColor: added 
                ? 'var(--color-secondary)' 
                : product.countInStock === 0 
                  ? '#9ca3af' 
                  : 'var(--color-primary)',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
          >
            {added ? 'Added ✓' : product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
