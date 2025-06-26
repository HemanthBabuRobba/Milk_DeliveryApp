import React from "react";
import "./OrderHistory.css";

const OrderHistory = () => {
  const orders = [
    {
      id: "ORD12345",
      date: "18 May 2025, 6:32 PM",
      details: [
        { name: "Fresh Milk", quantity: 2, pricePerLiter: 2.5, total: 5.0 },
      ],
      deliveryAddress: "123 Main Street, Springfield",
      landmark: "Near City Park",
      deliverySlot: "Morning 6–9 AM",
      deliveryDate: "19 May 2025",
      orderNotes: "Leave at the doorstep",
      status: "Delivered",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD67890",
      date: "17 May 2025, 4:15 PM",
      details: [
        { name: "Almond Milk", quantity: 1, pricePerLiter: 3.5, total: 3.5 },
      ],
      deliveryAddress: "456 Elm Street, Springfield",
      landmark: "",
      deliverySlot: "Evening 5–8 PM",
      deliveryDate: "17 May 2025",
      orderNotes: "",
      status: "Pending",
      paymentMethod: "UPI Payment",
    },
  ];

  const handleReorder = (order) => {
    alert(`Reordered items from Order ID: ${order.id}`);
    console.log("Reordered:", order);
  };

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p className="no-orders">You have no past orders.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h2>Order ID: {order.id}</h2>
              <p>
                <strong>Order Date:</strong> {order.date}
              </p>
              <div className="order-details">
                <h3>Order Details:</h3>
                <ul>
                  {order.details.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity}L @ $
                      {item.pricePerLiter.toFixed(2)} per liter
                      <span className="item-total">
                        Total: ${item.total.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </p>
              {order.landmark && (
                <p>
                  <strong>Landmark:</strong> {order.landmark}
                </p>
              )}
              <p>
                <strong>Delivery Slot:</strong> {order.deliverySlot} on{" "}
                {order.deliveryDate}
              </p>
              {order.orderNotes && (
                <p>
                  <strong>Order Notes:</strong> {order.orderNotes}
                </p>
              )}
              <p>
                <strong>Order Status:</strong>{" "}
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <button
                className="reorder-button"
                onClick={() => handleReorder(order)}
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
