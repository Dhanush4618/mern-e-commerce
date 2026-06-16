import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UserListPage from './pages/admin/UserListPage';
import ProductListPage from './pages/admin/ProductListPage';
import OrderListPage from './pages/admin/OrderListPage';

function App() {
  const { userInfo, logout } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="container header-container">
            <Link to="/" className="logo">Gravity Shop</Link>
            <nav className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/cart" className="nav-link">Cart</Link>

              {userInfo ? (
                <div style={{ position: 'relative', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Link to="/profile" className="nav-link" style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{userInfo.name}</Link>
                  <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Logout</button>

                  {userInfo.isAdmin && (
                    <div style={{ display: 'flex', gap: '1rem', borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>
                      <span style={{ color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase' }}>Admin</span>
                      <Link to="/admin/userlist" className="nav-link">Users</Link>
                      <Link to="/admin/productlist" className="nav-link">Products</Link>
                      <Link to="/admin/orderlist" className="nav-link">Orders</Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-link">Sign In</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin Routes */}
              <Route path="/admin/userlist" element={<UserListPage />} />
              <Route path="/admin/productlist" element={<ProductListPage />} />
              <Route path="/admin/orderlist" element={<OrderListPage />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} AntiGravity Shop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
