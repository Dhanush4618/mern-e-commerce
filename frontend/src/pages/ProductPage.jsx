import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Loading product details...</h2>;
  
  if (error) return (
    <div style={{ marginTop: '2rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '1.5rem' }}>
        ← Go Back
      </Link>
      <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5' }}>
        <h3>Error Loading Product</h3>
        <p>{error}</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '1.5rem' }}>
        ← Go Back
      </Link>
      <h2>Product not found</h2>
    </div>
  );

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', marginBottom: '1.5rem', transition: 'color 0.2s' }} className="nav-link">
        ← Go Back
      </Link>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {/* Left Column: Image */}
        <div style={{ flex: '1 1 400px', maxWidth: '550px' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              borderRadius: 'var(--border-radius)', 
              boxShadow: 'var(--shadow-md)', 
              objectFit: 'cover',
              maxHeight: '450px'
            }} 
            onError={(e) => {
              // Fallback image if local image isn't built yet
              e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
            }}
          />
        </div>
        
        {/* Middle Column: Details */}
        <div style={{ flex: '2 1 300px' }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '1px' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
            {product.name}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <span style={{ color: '#FBBF24', fontSize: '1.25rem' }}>
              {'★'.repeat(Math.round(product.rating || 0))}
              {'☆'.repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>({product.numReviews} reviews)</span>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              {product.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Brand</span>
              <p style={{ fontWeight: 600 }}>{product.brand}</p>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Category</span>
              <p style={{ fontWeight: 600 }}>{product.category}</p>
            </div>
          </div>
        </div>
        
        {/* Right Column: Checkout Card */}
        <div style={{ flex: '1 1 280px', maxWidth: '360px' }}>
          <div 
            style={{ 
              background: 'white', 
              border: '1px solid var(--color-border)', 
              borderRadius: 'var(--border-radius)', 
              padding: '2rem', 
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '100px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Price:</span>
              <strong style={{ fontSize: '1.35rem', color: 'var(--color-text-main)' }}>${product.price?.toFixed(2)}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Status:</span>
              <span style={{ color: product.countInStock > 0 ? 'var(--color-secondary)' : '#ef4444', fontWeight: 'bold' }}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            {product.countInStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Quantity:</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))} 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    fontWeight: 600
                  }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button 
              onClick={addToCartHandler} 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                padding: '1.1rem', 
                borderRadius: '8px', 
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
              }} 
              disabled={product.countInStock === 0}
            >
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
