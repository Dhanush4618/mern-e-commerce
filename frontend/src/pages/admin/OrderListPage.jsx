import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../axiosInstance';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', { withCredentials: true });
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>USER</th>
              <th style={{ padding: '1rem' }}>DATE</th>
              <th style={{ padding: '1rem' }}>TOTAL</th>
              <th style={{ padding: '1rem' }}>PAID</th>
              <th style={{ padding: '1rem' }}>DELIVERED</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{order._id}</td>
                <td style={{ padding: '1rem' }}>{order.user && order.user.name}</td>
                <td style={{ padding: '1rem' }}>{order.createdAt.substring(0, 10)}</td>
                <td style={{ padding: '1rem' }}>${order.totalPrice}</td>
                <td style={{ padding: '1rem' }}>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>✕</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>✕</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;
