import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsUserLoggedIn, setIsAdminLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (isUserLoggedIn) {
      navigate('/home');
    } else if (isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/${isAdmin ? 'admin' : 'auth'}/login`,
        { username, password }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data.admin));
        
        if (isAdmin) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('isAdminLoggedIn', 'true');
          navigate('/admin');
        } else {
          setIsUserLoggedIn(true);
          localStorage.setItem('isUserLoggedIn', 'true');
          navigate('/home');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-intro">
        <h2>Welcome Back!</h2>
        <p>Sign in to access your account and manage your milk orders.</p>
      </div>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="login-label">Username</label>
          <input
            type="text"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <label className="login-label">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="admin-checkbox-container">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                className="admin-checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              Login as Admin
            </label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;