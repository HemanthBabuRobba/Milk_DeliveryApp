import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsUserLoggedIn, setIsAdminLoggedIn }) => {
  const [loginType, setLoginType] = useState('User');
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
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

  const handleLoginTypeChange = (e) => {
    setLoginType(e.target.value);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials({ ...adminCredentials, [name]: value });
  };

  const handleLogin = () => {
    if (loginType === 'Admin') {
      if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin123') {
        setIsAdminLoggedIn(true);
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin');
      } else {
        setError('Invalid Admin Credentials');
      }
    } else {
      setIsUserLoggedIn(true);
      localStorage.setItem('isUserLoggedIn', 'true');
      navigate('/home');
    }
  };

  return (
    <div className="login-page">
      <div className="login-intro">
        <h2>Welcome to Milk App 🥛</h2>
        <p>
          Get the freshest milk delivered to your doorstep every day.<br />
          Fast, local, and always pure. Start your healthy day with us!
        </p>
      </div>
      <form
        className="login-container"
        onSubmit={e => {
          e.preventDefault();
          handleLogin();
        }}
        autoComplete="off"
      >
        <div className="login-title">Login</div>
        <div className="login-type">
          <label>
            <input
              type="radio"
              value="User"
              checked={loginType === 'User'}
              onChange={handleLoginTypeChange}
            />
            <span>Login as User</span>
          </label>
          <label>
            <input
              type="radio"
              value="Admin"
              checked={loginType === 'Admin'}
              onChange={handleLoginTypeChange}
            />
            <span>Login as Admin</span>
          </label>
        </div>

        {loginType === 'Admin' && (
          <div className="admin-credentials">
            <label className="login-label">
              Username
              <input
                className="login-input"
                type="text"
                name="username"
                value={adminCredentials.username}
                onChange={handleInputChange}
                autoComplete="username"
                required
              />
            </label>
            <label className="login-label">
              Password
              <input
                className="login-input"
                type="password"
                name="password"
                value={adminCredentials.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
              />
            </label>
          </div>
        )}

        {error && <div className="login-error">{error}</div>}

        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;