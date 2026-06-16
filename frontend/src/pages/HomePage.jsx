import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock data fallback if API is not running or DB connection fails
        try {
          const { data } = await axios.get('/api/products');
          setProducts(data.products || data);
        } catch (apiError) {
          console.error("API Error, using fallback data", apiError);
          setProducts([
            {
              _id: '1',
              name: 'Airpods Wireless Bluetooth Headphones',
              image: 'https://images.unsplash.com/photo-1606220588913-b3eea2ceb750?w=500&q=80',
              description: 'Bluetooth technology lets you connect it with compatible devices wirelessly',
              brand: 'Apple',
              category: 'Electronics',
              price: 89.99,
              countInStock: 10,
              rating: 4.5,
              numReviews: 12,
            },
            {
              _id: '2',
              name: 'iPhone 13 Pro 256GB Memory',
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
              description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system.',
              brand: 'Apple',
              category: 'Electronics',
              price: 999.99,
              countInStock: 7,
              rating: 4.8,
              numReviews: 8,
            },
            {
              _id: '3',
              name: 'Cannon EOS 80D DSLR Camera',
              image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
              description: 'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself.',
              brand: 'Cannon',
              category: 'Electronics',
              price: 929.99,
              countInStock: 5,
              rating: 3.5,
              numReviews: 12,
            },
          ]);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
