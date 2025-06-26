import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

// Move useCart inside the file but outside the provider
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCart({ items: [], totalAmount: 0 });
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCart(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.response?.data?.message || "Failed to load cart");
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Ensure we have the product ID string
      const productIdString =
        typeof productId === "object" ? productId._id : productId;

      // Optimistically update the UI
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          // Ensure comparison is with the product ID string
          if (
            (typeof item.product === "object"
              ? item.product._id
              : item.product) === productIdString
          ) {
            return { ...item, quantity };
          }
          return item;
        });
        return { ...prevCart, items: updatedItems };
      });

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update/${productIdString}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update with server response
      setCart(response.data);
      return true;
    } catch (error) {
      // Revert optimistic update on error
      fetchCart();
      console.error("Error updating cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Optimistically update the UI
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.product !== productId),
      }));

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update with server response
      setCart(response.data);
      return true;
    } catch (error) {
      // Revert optimistic update on error
      fetchCart();
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Optimistically update the UI
      setCart({ items: [], totalAmount: 0 });

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (error) {
      // Revert optimistic update on error
      fetchCart();
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { useCart };
