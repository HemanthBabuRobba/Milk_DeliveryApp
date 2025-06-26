import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="home-page">
      <h1>Welcome to SwachMilk</h1>
      <p>Your one-stop solution for fresh milk delivery</p>

      <div className="home-links">
        <Link to="/product" className="home-button">
          Browse Products
        </Link>
        <Link to="/cart" className="home-button">
          View Cart
        </Link>
        <Link to="/order-history" className="home-button">
          Order History
        </Link>
        <Link to="/checkout" className="home-button">
          Checkout
        </Link>
      </div>

      <div className="about-section">
        <h2 className="about-title">About Our Service</h2>
        <p className="about-text">
          We deliver fresh, high-quality milk directly to your doorstep. Our
          commitment to quality and customer satisfaction makes us the preferred
          choice for daily milk delivery. Choose from our wide range of dairy
          products and enjoy the convenience of home delivery.
        </p>
      </div>
    </div>
  );
};

export default Home;
