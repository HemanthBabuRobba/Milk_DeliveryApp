import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const { cartItems } = location.state || {
    cartItems: [],
  };

  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    mobileNumber: "",
    address: "",
    landmark: "",
  });
  const [deliveryPreferences, setDeliveryPreferences] = useState({
    deliveryDate: "Today",
    timeSlot: "Morning 6–9 AM",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const deliveryCharge = 2.0; // Example delivery charge
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const finalTotal = subtotal + deliveryCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleDeliveryPreferenceChange = (e) => {
    const { name, value } = e.target;
    setDeliveryPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value,
    }));
  };

  const handlePlaceOrder = () => {
    const orderData = {
      customerDetails,
      deliveryPreferences,
      orderNotes,
      paymentMethod,
      cartItems,
      finalTotal,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData)
      .then(() => {
        // handle success
        alert("Order placed successfully!");
      })
      .catch((err) => {
        // handle error
        console.error("Error placing order:", err);
        alert("There was an error placing your order. Please try again.");
      });
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Order Summary */}
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        <ul>
          {cartItems.map((item) => (
            <li
              key={item._id || item.id || `item-${item.name}-${item.quantity}`}
            >
              <span>
                {item.name} - {item.quantity}L
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
        <p className="final-total">Total: ₹{finalTotal.toFixed(2)}</p>
      </div>

      {/* Customer Details Form */}
      <div className="customer-details">
        <h2>Customer Details</h2>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={customerDetails.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobileNumber"
          value={customerDetails.mobileNumber}
          onChange={handleInputChange}
          placeholder="Enter your mobile number"
        />
        <label>Delivery Address:</label>
        <textarea
          name="address"
          value={customerDetails.address}
          onChange={handleInputChange}
          placeholder="Enter your delivery address"
        ></textarea>
        <label>Landmark / Area (Optional):</label>
        <input
          type="text"
          name="landmark"
          value={customerDetails.landmark}
          onChange={handleInputChange}
          placeholder="Enter a landmark (optional)"
        />
      </div>

      {/* Delivery Preferences */}
      <div className="delivery-preferences">
        <h2>Delivery Preferences</h2>
        <label>Preferred Delivery Date:</label>
        <select
          name="deliveryDate"
          value={deliveryPreferences.deliveryDate}
          onChange={handleDeliveryPreferenceChange}
        >
          <option value="Today" key="today">
            Today
          </option>
          <option value="Tomorrow" key="tomorrow">
            Tomorrow
          </option>
        </select>
        <label>Preferred Time Slot:</label>
        <select
          name="timeSlot"
          value={deliveryPreferences.timeSlot}
          onChange={handleDeliveryPreferenceChange}
        >
          <option value="Morning 6–9 AM" key="morning">
            Morning 6–9 AM
          </option>
          <option value="Evening 5–8 PM" key="evening">
            Evening 5–8 PM
          </option>
        </select>
      </div>

      {/* Order Notes */}
      <div className="order-notes">
        <h2>Order Notes (Optional)</h2>
        <textarea
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Any special instructions (e.g., Leave at doorstep)"
        ></textarea>
      </div>

      {/* Payment Method */}
      <div className="payment-method">
        <h2>Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Cash on Delivery" key="cod">
            Cash on Delivery
          </option>
          <option value="UPI Payment" key="upi">
            UPI Payment
          </option>
          <option value="Pay Later" key="paylater">
            Pay Later
          </option>
        </select>
      </div>

      {/* Confirm Order Button */}
      <button className="place-order-button" onClick={handlePlaceOrder}>
        Confirm Order
      </button>

      {/* Trust Section */}
      <div className="trust-section">
        <p>
          🔒 We respect your privacy. Your contact info will only be used for
          delivery.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
