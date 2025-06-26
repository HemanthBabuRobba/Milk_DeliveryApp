import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedOrders = localStorage.getItem("orderHistory");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Persist cart for guests only
  useEffect(() => {
    if (!user) localStorage.setItem("cart", JSON.stringify(cart));
    else localStorage.removeItem("cart");
  }, [cart, user]);

  // On login, fetch cart and orders
  useEffect(() => {
    if (user) {
      fetchCart(user.userId);
      fetchOrders(user.userId);
    } else {
      // For guests, load cart from localStorage
      const savedCart = localStorage.getItem("cart");
      setCart(savedCart ? JSON.parse(savedCart) : []);
      setOrderHistory([]);
    }
  }, [user]);

  const login = (userObj) => {
    setUser(userObj);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setOrderHistory([]);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
    setProducts(res.data);
  };

  // Add to cart: only persist if logged in
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      // Guest cart (local only)
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product._id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          return [
            ...prev,
            {
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
            },
          ];
        }
      });
      return;
    }
    // Logged-in: persist in backend
    let currentCart = [];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/${user.userId}`,
      );
      currentCart = res.data;
    } catch (err) {
      currentCart = [];
    }
    const existing = currentCart.find((item) => item.productId === product._id);
    let updatedCart;
    if (existing) {
      updatedCart = currentCart.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }
    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      userId: user.userId,
      items: updatedCart,
    });
    setCart(updatedCart);
  };

  // Fetch cart
  const fetchCart = async (userId) => {
    if (!userId) return;
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/cart/${userId}`,
    );
    setCart(res.data);
  };

  // Checkout: place order and clear cart
  const checkout = async (orderDetails) => {
    if (!user) return;
    // orderDetails: { items, totalAmount, userInfo, delivery, notes, paymentMethod }
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
      userId: user.userId,
      items: cart,
      ...orderDetails,
    });
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/${user.userId}`,
    );
    setCart([]);
    fetchOrders(user.userId);
    return res.data; // contains order with unique _id
  };

  // Fetch orders
  const fetchOrders = async (userId) => {
    if (!userId) return;
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/orders/${userId}`,
    );
    setOrders(res.data);
    setOrderHistory(res.data);
  };

  // Reorder: add order items to cart
  const reorder = async (order) => {
    if (!user) return;
    // Add all items from order to cart
    let currentCart = [];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/${user.userId}`,
      );
      currentCart = res.data;
    } catch (err) {
      currentCart = [];
    }
    // Merge items
    const merged = [...currentCart];
    order.items.forEach((orderItem) => {
      const existing = merged.find(
        (item) => item.productId === orderItem.productId,
      );
      if (existing) {
        existing.quantity += orderItem.quantity;
      } else {
        merged.push({ ...orderItem });
      }
    });
    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
      userId: user.userId,
      items: merged,
    });
    setCart(merged);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        addToCart,
        orderHistory,
        products,
        fetchProducts,
        fetchCart,
        checkout,
        fetchOrders,
        reorder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
