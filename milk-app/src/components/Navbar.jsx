import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-link" activeClassName="active-link" exact>
        Home
      </NavLink>
      <NavLink to="/cart" className="nav-link" activeClassName="active-link">
        Cart
      </NavLink>
      <NavLink to="/checkout" className="nav-link" activeClassName="active-link">
        Checkout
      </NavLink>
      <NavLink to="/orders" className="nav-link" activeClassName="active-link">
        Orders
      </NavLink>
    </nav>
  );
};

export default Navbar;