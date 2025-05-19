import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import MilkImage from '../assets/LogoPic.jpg';

const Product = () => {
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [cart, setCart] = useState([]); // Cart items
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const product = {
    id: 1,
    name: 'Fresh Milk',
    price: 2.5,
    image: MilkImage,
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddToCart = () => {
    const newCartItem = { ...product, quantity };
    setCart((prevCart) => [...prevCart, newCartItem]);
    alert(`${quantity}L of ${product.name} added to the cart.`);
  };

  const handleGoToCart = () => {
    navigate('/cart', { state: { cart } }); // Pass cart data to the Cart page
  };

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} className="product-image" />
      <p className="product-price">Price per liter: ${product.price.toFixed(2)}</p>

      <div className="quantity-selector">
        <label htmlFor="quantity">Select Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>

      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Add to Cart
      </button>

      <button className="go-to-cart-button" onClick={handleGoToCart}>
        Go to Cart
      </button>
    </div>
  );
};

export default Product;