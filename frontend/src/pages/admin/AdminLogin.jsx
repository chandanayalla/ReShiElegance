import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import './Admin.css';

const AdminLogin = () => {
  const { login, isAuthenticated, loading } = useContext(AdminAuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="admin-login-shell d-flex align-items-center justify-content-center min-vh-100 bg-pink-light px-3">
      <div className="admin-login-card p-4 rounded-4 shadow-sm bg-white w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <div className="login-logo mb-3">ReShi Elegance</div>
          <p className="text-muted mb-0">Simple admin access for product and order management.</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-4"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-4"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
