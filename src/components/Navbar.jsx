// /src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
      <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Shop</NavLink>
      <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Cart</NavLink>
    </nav>
  );
}
