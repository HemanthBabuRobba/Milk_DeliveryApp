import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cart || [];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleConfirmOrder = () => {
    const totalPrice = calculateSubtotal();
    navigate('/checkout', { state: { cartItems, totalPrice } }); // Pass cart data to Checkout
  };

  // Call this function when saving cart
  const saveCart = (userId, cartItems) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/cart`, {
      userId,
      items: cartItems
    });
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty. Add some milk!</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <p className="item-name">{item.name}</p>
                <p className="item-price">Price: ${item.price.toFixed(2)} per liter</p>
                <p className="item-quantity">Quantity: {item.quantity}L</p>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
          </div>

          <button className="confirm-order-button" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;