import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
  const { shippingAddress, savePaymentMethod } = useCart();
  const navigate = useNavigate();

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>Payment Method</h2>
      <form onSubmit={submitHandler} style={{ marginTop: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="Stripe" 
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '20px', height: '20px' }}
            />
            Stripe / Credit Card
          </label>
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
