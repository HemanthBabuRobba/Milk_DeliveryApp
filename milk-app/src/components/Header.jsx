import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem("isAdminLoggedIn");

    // Navigate to login page with replace to prevent back navigation
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div className="header-logo">SwachMilk</div>
      <nav className="header-nav">
        <Link to="/home" className="header-link">
          Home
        </Link>
        <Link to="/product" className="header-link">
          Products
        </Link>
        <Link to="/cart" className="header-link">
          Cart
        </Link>
        <Link to="/checkout" className="header-link">
          Checkout
        </Link>
        <Link to="/order-history" className="header-link">
          Order History
        </Link>
      </nav>
      <button onClick={handleLogout} className="header-logout">
        <span className="logout-icon">🚪</span>
        <span className="logout-text">Logout</span>
      </button>
    </header>
  );
};

export default Header;
