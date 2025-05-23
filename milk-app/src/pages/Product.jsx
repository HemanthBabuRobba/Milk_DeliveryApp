import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import MilkImage from '../assets/LogoPic.jpg';

const Product = () => {
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(response.data);
      // Initialize quantities for each product
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    if (numValue > 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: numValue
      }));
    }
  };

  const handleBuyNow = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const quantity = quantities[product._id] || 1;

      // Validate quantity
      if (quantity > product.quantity) {
        showAlert(`Only ${product.quantity} units available in stock`, 'warning');
        return;
      }

      // Create a temporary cart item for checkout
      const checkoutItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        unit: product.unit
      };

      navigate('/checkout', { 
        state: { 
          cartItems: [checkoutItem],
          totalPrice: product.price * quantity,
          isDirectCheckout: true
        } 
      });
    } catch (error) {
      console.error('Error preparing checkout:', error);
      setError('Failed to proceed to checkout');
      showAlert('Failed to proceed to checkout. Please try again.', 'error');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const quantity = quantities[product._id] || 1;

      // Validate quantity
      if (quantity > product.quantity) {
        showAlert(`Only ${product.quantity} units available in stock`, 'warning');
        return;
      }

      // Set loading state for this product
      setAddingToCart(prev => ({ ...prev, [product._id]: true }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          productId: product._id,
          quantity: quantity
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        showAlert(`${quantity} ${product.unit} of ${product.name} added to cart`, 'success');
      }
    } catch (error) {
      console.error('Error adding to cart:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
        return;
      }

      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      setError(errorMessage);
      showAlert(errorMessage, 'error');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return <div className="product-page">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="error-message">{error}</div>
        <button onClick={() => setError('')}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      {alert.show && (
        <div className={`custom-alert ${alert.type}`}>
          <span className="custom-alert-message">{alert.message}</span>
          <button 
            className="custom-alert-close"
            onClick={() => setAlert({ show: false, message: '', type: '' })}
          >
            ×
          </button>
        </div>
      )}
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img 
              src={product.image || MilkImage} 
              alt={product.name} 
              className="product-image" 
            />
            <h2>{product.name}</h2>
            <p className="product-price">₹{product.price.toFixed(2)} per {product.unit}</p>
            <p className="product-stock">Stock: {product.quantity} {product.unit}</p>

            <div className="counter-container">
              <button
                className="counter-button"
                onClick={() => handleQuantityChange(product._id, Math.max(1, (quantities[product._id] || 1) - 1))}
                disabled={quantities[product._id] <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="counter-value"
                id={`quantity-${product._id}`}
                min="1"
                max={product.quantity}
                value={quantities[product._id] || 1}
                onChange={(e) => handleQuantityChange(product._id, Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
              />
              <button
                className="counter-button"
                onClick={() => handleQuantityChange(product._id, Math.min(product.quantity, (quantities[product._id] || 1) + 1))}
                disabled={quantities[product._id] >= product.quantity}
              >
                +
              </button>
            </div>

            <div className="product-actions">
              <button 
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product)}
                disabled={product.quantity < 1 || addingToCart[product._id]}
              >
                {addingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                className="buy-now-button"
                onClick={() => handleBuyNow(product)}
                disabled={product.quantity < 1}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="go-to-cart-container">
        <button className="go-to-cart-button" onClick={handleGoToCart}>
          <span>Go to Cart</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Product;