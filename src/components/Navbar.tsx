import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/assets/logo.gif" alt="Logo" className="navbar-logo-img" /> <br />
        </Link>

        {/* Hamburger */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Links */}
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/members"
            className={location.pathname.startsWith("/members") ? "active" : ""}
            onClick={() => setIsOpen(false)}
          >
            Members
          </Link>
          <Link
            to="/radio"
            className={location.pathname.startsWith("/radio") ? "active" : ""}
            onClick={() => setIsOpen(false)}
          >
            Radio Station
          </Link>
          <a
            href="https://discord.gg/6VeVAHaXfN"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            Discord
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
