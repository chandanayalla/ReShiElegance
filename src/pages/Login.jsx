import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const googleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err?.message || 'Unable to start Google login');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="container-fluid">
          <div className="auth-content">
            <div className="auth-card">
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Login to your ReShi Elegance account</p>
              </div>

              {error && (
                <div className="alert alert-danger mb-3">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {googleAuthEnabled && (
                <>
                  <div className="auth-divider">OR</div>

                  <button className="btn btn-outline-primary w-100 mb-3" type="button" onClick={handleGoogleLogin} disabled={isLoading}>
                    <i className="bi bi-google me-2"></i>
                    Continue with Google
                  </button>
                </>
              )}

              <div className="auth-footer">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
                <p><Link to="/forgot-password">Forgot password?</Link></p>
              </div>
            </div>

            {/* Illustration */}
            <div className="auth-illustration">
              <img
                src="https://images.unsplash.com/photo-1609631183071-fdfb62db3bbd?w=500&h=600&fit=crop"
                alt="Saree"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
