import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/${orderId}`, { withCredentials: true });
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const payOrderHandler = async () => {
    try {
      setLoadingPay(true);
      const paymentResult = {
        id: 'simulated_pay_' + Math.random().toString(36).substr(2, 9),
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: userInfo ? userInfo.email : 'customer@example.com',
      };
      await axios.put(`/api/orders/${orderId}/pay`, paymentResult, { withCredentials: true });
      setLoadingPay(false);
      // Reload order details
      const { data } = await axios.get(`/api/orders/${orderId}`, { withCredentials: true });
      setOrder(data);
    } catch (err) {
      setLoadingPay(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  const deliverOrderHandler = async () => {
    try {
      setLoadingDeliver(true);
      await axios.put(`/api/orders/${orderId}/deliver`, {}, { withCredentials: true });
      setLoadingDeliver(false);
      // Reload order details
      const { data } = await axios.get(`/api/orders/${orderId}`, { withCredentials: true });
      setOrder(data);
    } catch (err) {
      setLoadingDeliver(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>  Loading Order details...</h2>;
  if (error) return (
    <div style={{ marginTop: '2rem' }}>
      <Link to="/profile" className="btn-primary" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>Go Back To Profile</Link>
      <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', border: '1px solid #fca5a5' }}>
        <h3>Error Loading Order</h3>
        <p>{error}</p>
      </div>
    </div>
  );
  if (!order) return <h2>Order not found</h2>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Order ID: <span style={{ color: 'var(--color-primary)' }}>{order._id}</span></h1>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left column */}
        <div style={{ flex: '3 1 500px' }}>
          {/* Shipping section */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Shipping Details</h2>
            <p style={{ marginBottom: '0.8rem' }}>
              <strong>Name: </strong> {order.user ? order.user.name : 'Unknown User'} <br />
              <strong>Email: </strong> {order.user ? <a href={`mailto:${order.user.email}`} style={{ color: 'var(--color-primary)' }}>{order.user.email}</a> : 'No Email'}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', fontWeight: 500 }}>
                Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontWeight: 500 }}>
                Not Delivered
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Payment Method</h2>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', fontWeight: 500 }}>
                Paid on {new Date(order.paidAt).toLocaleString()} (Transaction ID: {order.paymentResult?.id})
              </div>
            ) : (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontWeight: 500 }}>
                Not Paid
              </div>
            )}
          </div>

          {/* Order Items Section */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Order contains no items.</p>
            ) : (
              <div>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '55px', borderRadius: '8px', marginRight: '1.2rem', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                      }}
                    />
                    <Link to={`/product/${item.product}`} style={{ flex: 1, fontWeight: '600', color: 'var(--color-text-main)' }}>
                      {item.name}
                    </Link>
                    <div style={{ fontWeight: 500 }}>
                      {item.qty} x ${item.price.toFixed(2)} = <strong style={{ color: 'var(--color-primary)' }}>${(item.qty * item.price).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Summary Card */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Order Summary</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Items</span>
              <span style={{ fontWeight: 500 }}>${(order.itemsPrice || 0).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: 500 }}>${(order.shippingPrice || 0).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Tax</span>
              <span style={{ fontWeight: 500 }}>${(order.taxPrice || 0).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>${(order.totalPrice || 0).toFixed(2)}</span>
            </div>

            {/* Pay Now Button (Client Action) */}
            {!order.isPaid && (
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={payOrderHandler}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1.1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600 }}
                  disabled={loadingPay}
                >
                  {loadingPay ? 'Processing Payment...' : 'Pay Now (Simulated Payment)'}
                </button>
              </div>
            )}

            {/* Deliver Order Button (Admin Action) */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={deliverOrderHandler}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-secondary)'
                  }}
                  disabled={loadingDeliver}
                >
                  {loadingDeliver ? 'Updating status...' : 'Mark As Delivered'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
