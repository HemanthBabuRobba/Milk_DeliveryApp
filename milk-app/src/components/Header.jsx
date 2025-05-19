import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">Milk App</div>
      <nav className="header-nav">
        <Link to="/home" className="header-link">Home</Link>
        <Link to="/product" className="header-link">Products</Link>
        <Link to="/cart" className="header-link">Cart</Link>
        <Link to="/checkout" className="header-link">Checkout</Link>
        <Link to="/order-history" className="header-link">Order History</Link>
      </nav>
    </header>
  );
};

export default Header;