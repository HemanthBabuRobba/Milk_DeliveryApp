import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = ({ setIsUserLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { username, email, password }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsUserLoggedIn(true);
        localStorage.setItem('isUserLoggedIn', 'true');
        
        // Show success message and redirect to home
        alert('Account created successfully!');
        navigate('/home');
      } else {
        setError('Registration successful but no token received');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-page">
      <div className="signup-intro">
        <h2>Join Our Community!</h2>
        <p>Create an account to start ordering fresh milk delivered to your doorstep.</p>
      </div>
      <div className="signup-container">
        <h2 className="signup-title">Sign Up</h2>
        {error && <div className="signup-error">{error}</div>}
        <form onSubmit={handleSignup}>
          <label className="signup-label">Username</label>
          <input
            type="text"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
          <label className="signup-label">Email</label>
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <label className="signup-label">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
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
          <label className="signup-label">Confirm Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="signup-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
