import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleIncorrectLogin = () => {
    // Clear any stored login state (optional)
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="home-page">
      <h1>Welcome to Milk App</h1>
      <p>Fresh Milk Available Today!</p>
      <div className="home-links">
        <button className="home-button" onClick={() => navigate('/product')}>
          Explore Products
        </button>
        <button className="home-button" onClick={() => navigate('/cart')}>
          View Cart
        </button>
        <button className="home-button" onClick={() => navigate('/order-history')}>
          Order History
        </button>
      </div>
      <div className="incorrect-login">
        <p>
          If you logged in incorrectly,{' '}
          <button className="incorrect-login-button" onClick={handleIncorrectLogin}>
            click here to log in again
          </button>.
        </p>
      </div>
    </div>
  );
};

export default Home;