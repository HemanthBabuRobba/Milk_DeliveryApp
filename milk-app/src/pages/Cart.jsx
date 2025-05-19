import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      console.log('Fetching cart with token:', token);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cart data received:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error.response || error);
      setError(error.response?.data?.message || 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      console.log('Updating quantity:', { productId, newQuantity });
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        { 
          productId: productId.toString(), // Ensure productId is a string
          quantity: parseInt(newQuantity) // Ensure quantity is a number
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log('Update response:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error.response || error);
      setError(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error removing item:', error.response || error);
      setError(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error.response || error);
      setError(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const proceedToCheckout = () => {
    if (cart && cart.items.length > 0) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-error">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={`${item.product}-${item.name}`} className="cart-item">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price} per {item.unit}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  <p>₹{item.price * item.quantity}</p>
                  <button
                    className="remove-button"
                    onClick={() => removeItem(item.product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total-amount">
              <h3>Total Amount:</h3>
              <p>₹{cart.totalAmount}</p>
            </div>
            <div className="cart-actions">
              <button className="clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="checkout-button" onClick={proceedToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/product')}>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;