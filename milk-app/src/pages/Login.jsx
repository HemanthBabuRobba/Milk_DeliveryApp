import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";

const Login = ({ setIsUserLoggedIn, setIsAdminLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

    if (token && isUserLoggedIn) {
      navigate("/home", { replace: true });
    } else if (token && isAdminLoggedIn) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const data = await authAPI.login({ email, password, isAdmin });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userType", isAdmin ? "admin" : "user");
        if (isAdmin) {
          setIsAdminLoggedIn(true);
          setIsUserLoggedIn(false);
          localStorage.setItem("isAdminLoggedIn", "true");
          localStorage.setItem("isUserLoggedIn", "false");
          navigate("/admin", { replace: true });
        } else {
          setIsUserLoggedIn(true);
          setIsAdminLoggedIn(false);
          localStorage.setItem("isUserLoggedIn", "true");
          localStorage.setItem("isAdminLoggedIn", "false");
          navigate("/home", { replace: true });
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-intro">
        <h2>Welcome Back!</h2>
        <p>Sign in to access your account and manage your milk orders.</p>
      </div>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <label className="login-label">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="admin-checkbox-container">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                className="admin-checkbox"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  setEmail("");
                  setPassword("");
                }}
              />
              Login as Admin
            </label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
