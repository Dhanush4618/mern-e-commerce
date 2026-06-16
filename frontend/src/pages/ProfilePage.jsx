import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosInstance';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const navigate = useNavigate();
  const { userInfo, loading, error, updateProfile } = useAuth();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      
      // Fetch user's orders
      const fetchOrders = async () => {
        try {
          const { data } = await axios.get('/api/orders/mine', { withCredentials: true });
          setOrders(data);
          setLoadingOrders(false);
        } catch (err) {
          console.error(err);
          setLoadingOrders(false);
        }
      };
      
      fetchOrders();
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const { data } = await axios.put('/api/users/profile', { id: userInfo._id, name, email, password }, { withCredentials: true });
        updateProfile(data);
        setMessage('Profile Updated Successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setMessage(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1, background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', height: 'fit-content' }}>
        <h2>User Profile</h2>
        {message && <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Enter new password" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Confirm new password" />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>Update</button>
        </form>
      </div>
      
      <div style={{ flex: 3 }}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You have no orders</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>DATE</th>
                <th style={{ padding: '1rem' }}>TOTAL</th>
                <th style={{ padding: '1rem' }}>PAID</th>
                <th style={{ padding: '1rem' }}>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/order/${order._id}`} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                      {order._id}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem' }}>{order.createdAt.substring(0, 10)}</td>
                  <td style={{ padding: '1rem' }}>${order.totalPrice}</td>
                  <td style={{ padding: '1rem' }}>{order.isPaid ? order.paidAt.substring(0, 10) : '✕'}</td>
                  <td style={{ padding: '1rem' }}>{order.isDelivered ? order.deliveredAt.substring(0, 10) : '✕'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
