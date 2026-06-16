import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error, register } = useAuth();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      register(name, email, password);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>Sign Up</h2>
      {message && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
      {loading && <p>Loading...</p>}
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
          Register
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--color-primary)' }}>Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage; 
