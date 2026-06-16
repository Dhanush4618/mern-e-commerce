import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../axiosInstance';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Modal State
  const [editProduct, setEditProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editImage, setEditImage] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStock, setEditStock] = useState(0);
  const [editDescription, setEditDescription] = useState('');

  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.products || data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await axios.post('/api/products', {}, { withCredentials: true });
        fetchProducts(); // Refresh list to show new sample product
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, { withCredentials: true });
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const openEditHandler = (product) => {
    setEditProduct(product);
    setEditName(product.name || '');
    setEditPrice(product.price || 0);
    setEditImage(product.image || '');
    setEditBrand(product.brand || '');
    setEditCategory(product.category || '');
    setEditStock(product.countInStock || 0);
    setEditDescription(product.description || '');
  };

  const editSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${editProduct._id}`, {
        name: editName,
        price: editPrice,
        image: editImage,
        brand: editBrand,
        category: editCategory,
        countInStock: editStock,
        description: editDescription,
      }, { withCredentials: true });
      
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button onClick={createProductHandler} className="btn-primary">
          + Create Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>NAME</th>
              <th style={{ padding: '1rem' }}>PRICE</th>
              <th style={{ padding: '1rem' }}>CATEGORY</th>
              <th style={{ padding: '1rem' }}>BRAND</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{product._id}</td>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>${product.price?.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>{product.category}</td>
                <td style={{ padding: '1rem' }}>{product.brand}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openEditHandler(product)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteHandler(product._id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            width: '90%',
            maxWidth: '600px',
            padding: '2.5rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setEditProduct(null)} 
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1.2rem',
                fontSize: '1.5rem',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              ✕
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Edit Product ID: <span style={{ color: 'var(--color-primary)' }}>{editProduct._id}</span></h2>
            
            <form onSubmit={editSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Product Name</label>
                <input 
                  type="text" 
                  required 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(Number(e.target.value))} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Stock Count</label>
                  <input 
                    type="number" 
                    required 
                    value={editStock} 
                    onChange={(e) => setEditStock(Number(e.target.value))} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Image URL</label>
                <input 
                  type="text" 
                  required 
                  value={editImage} 
                  onChange={(e) => setEditImage(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Brand</label>
                  <input 
                    type="text" 
                    required 
                    value={editBrand} 
                    onChange={(e) => setEditBrand(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Category</label>
                  <input 
                    type="text" 
                    required 
                    value={editCategory} 
                    onChange={(e) => setEditCategory(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Description</label>
                <textarea 
                  required 
                  rows="4" 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setEditProduct(null)} 
                  style={{ flex: 1, padding: '1rem', background: '#f3f4f6', borderRadius: '8px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'center', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 2, padding: '1rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
