import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import './App.css';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const userLoginState = localStorage.getItem('isUserLoggedIn') === 'true';
    const adminLoginState = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsUserLoggedIn(userLoginState);
    setIsAdminLoggedIn(adminLoginState);
  }, []);

  useEffect(() => {
    localStorage.setItem('isUserLoggedIn', isUserLoggedIn);
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn);
  }, [isUserLoggedIn, isAdminLoggedIn]);

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <Login
                setIsUserLoggedIn={setIsUserLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
              />
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn}>
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn}>
                <>
                  <Header />
                  <Product />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn}>
                <>
                  <Header />
                  <Cart />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn}>
                <>
                  <Header />
                  <Checkout />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute isLoggedIn={isUserLoggedIn}>
                <>
                  <Header />
                  <OrderHistory />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;