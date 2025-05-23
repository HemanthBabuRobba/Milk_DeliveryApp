import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart, loading, error: cartError } = useCart();
  const { showSuccess, showError } = useToast();
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, itemId: null, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Find the cart item to check stock
      const cartItem = cart.items.find(item => item._id === itemId);
      if (!cartItem) {
        showError('Item not found in cart');
        return;
      }

      // Validate quantity against product stock
      if (newQuantity > cartItem.product.quantity) {
        showError(`Only ${cartItem.product.quantity} units available in stock`);
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        updateQuantity(itemId, newQuantity);
        showSuccess('Cart updated successfully');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      showError(errorMessage);
      fetchCart(); // Refresh cart on error
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      showSuccess('Item removed from cart');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to remove item');
      fetchCart(); // Refresh cart on error
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setConfirmDialog({
        show: true,
        itemId: productId,
        message: 'Are you sure you want to remove this item from your cart?'
      });
    } catch (error) {
      console.error('Error preparing to remove item:', error);
      showNotification('Failed to prepare item removal', 'error');
    }
  };

  const handleConfirmRemove = async () => {
    try {
      if (!confirmDialog.itemId) {
        console.error('No item ID found in confirmDialog');
        showNotification('Invalid item selected', 'error');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Call the API to remove the item
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${confirmDialog.itemId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update local cart state
        await removeFromCart(confirmDialog.itemId);
        showSuccess('Item removed from cart successfully');
        // Refresh cart to ensure UI is in sync with database
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove item';
      showNotification(errorMessage, 'error');
      // Refresh cart on error to ensure UI is in sync
      await fetchCart();
    } finally {
      setConfirmDialog({ show: false, itemId: null, message: '' });
    }
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ show: false, itemId: null, message: '' });
  };

  const handleClearCart = async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to clear your entire cart?');
      if (!confirmed) {
        return;
      }

      await clearCart();
      showSuccess('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      showNotification(errorMessage, 'error');
      fetchCart(); // Refresh cart on error
    }
  };

  const proceedToCheckout = () => {
    if (cart.items && cart.items.length > 0) {
      navigate('/checkout', {
        state: {
          cartItems: cart.items,
          totalPrice: calculateTotal()
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="cart-container">
        <div className="cart-error">
          <p>{cartError}</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {confirmDialog.show && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <p>{confirmDialog.message}</p>
            <div className="confirm-dialog-buttons">
              <button className="confirm-button" onClick={handleConfirmRemove}>
                Yes, Remove
              </button>
              <button className="cancel-button" onClick={handleCancelRemove}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <h2>Your Cart</h2>
      {cart.items && cart.items.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price.toFixed(2)} per {item.unit}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="counter-container">
                    <button
                      className="counter-button"
                      onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="counter-value">{item.quantity}</span>
                    <button
                      className="counter-button"
                      onClick={() => handleUpdateQuantity(item._id, Math.min(item.product?.quantity || 1, item.quantity + 1))}
                      disabled={item.quantity >= (item.product?.quantity || 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeItem(item._id)}
                  >
                    <FaTrash />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total-amount">
              <h3>Total Amount:</h3>
              <p>₹{calculateTotal().toFixed(2)}</p>
            </div>
            <div className="cart-actions">
              <button className="clear-cart" onClick={handleClearCart}>
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