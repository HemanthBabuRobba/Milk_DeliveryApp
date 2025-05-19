import React, { useState } from 'react';
import './MilkCard.css';

interface MilkCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  onPay: (quantity: number) => void;
}

const MilkCard: React.FC<MilkCardProps> = ({ title, description, imageUrl, price, onPay }) => {
  const [quantity, setQuantity] = useState(0.5); // Default to half-liter

  const handleQuantityChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="milk-card">
      <img src={imageUrl} alt={title} className="milk-card-image" />
      <h2 className="milk-card-title">{title}</h2>
      <p className="milk-card-description">{description}</p>
      <p className="milk-card-price">Price per liter: ${price.toFixed(2)}</p>

      <div className="milk-card-quantity">
        <label htmlFor="quantity-select">Select quantity:</label>
        <select
          id="quantity-select"
          value={quantity}
          onChange={handleQuantityChange}
          className="milk-card-select"
        >
          <option value={0.5}>0.5 Liter</option>
          <option value={1}>1 Liter</option>
        </select>

        {quantity === 0 && (
          <input
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Enter liters"
            onChange={handleQuantityChange}
            className="milk-card-input"
          />
        )}
      </div>

      <button className="milk-card-button" onClick={() => onPay(quantity)}>
        Buy Now
      </button>
    </div>
  );
};

export default MilkCard;