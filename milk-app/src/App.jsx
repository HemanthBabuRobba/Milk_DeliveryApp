import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import './styles/global.css';

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
    <ToastProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true }}>
          <ScrollToTop />
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/login"
                element={
                  <Login
                    setIsUserLoggedIn={setIsUserLoggedIn}
                    setIsAdminLoggedIn={setIsAdminLoggedIn}
                  />
                }
              />
              <Route
                path="/signup"
                element={<Signup setIsUserLoggedIn={setIsUserLoggedIn} />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute isLoggedIn={isAdminLoggedIn} isAdmin={isAdminLoggedIn}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected User Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute isLoggedIn={isUserLoggedIn} isAdmin={isAdminLoggedIn}>
                    <>
                      <Header />
                      <main className="main-content">
                        <Home />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product"
                element={
                  <ProtectedRoute isLoggedIn={isUserLoggedIn} isAdmin={isAdminLoggedIn}>
                    <>
                      <Header />
                      <main className="main-content">
                        <Product />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute isLoggedIn={isUserLoggedIn} isAdmin={isAdminLoggedIn}>
                    <>
                      <Header />
                      <main className="main-content">
                        <Cart />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute isLoggedIn={isUserLoggedIn} isAdmin={isAdminLoggedIn}>
                    <>
                      <Header />
                      <main className="main-content">
                        <Checkout />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-history"
                element={
                  <ProtectedRoute isLoggedIn={isUserLoggedIn} isAdmin={isAdminLoggedIn}>
                    <>
                      <Header />
                      <main className="main-content">
                        <OrderHistory />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;