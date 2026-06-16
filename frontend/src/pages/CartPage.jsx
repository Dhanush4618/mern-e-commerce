import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty <Link to="/">Go Back</Link>
        </p>
      ) : (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 3 }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', borderRadius: '4px', marginRight: '1rem' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 'bold' }}>{item.name}</Link>
                </div>
                <div style={{ width: '80px', fontWeight: 'bold' }}>${item.price.toFixed(2)}</div>
                <div style={{ marginRight: '1rem' }}>
                  <select 
                    value={item.qty} 
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                    style={{ padding: '0.5rem', borderRadius: '4px' }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product)} 
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </p>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} 
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
