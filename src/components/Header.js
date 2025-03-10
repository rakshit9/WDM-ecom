import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa"; // Import icons
import "../styles/header.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Function to count total items in cart
  const getCartItemCount = () => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.items, 0);
    setCartItemCount(totalItems);
  };

  // Fetch cart count on component mount & update when localStorage changes
  useEffect(() => {
    getCartItemCount();
    const interval = setInterval(getCartItemCount, 500); // Check every 500ms
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          AGODA
        </Link>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>
          <Link to="/productList" className="nav-item">
            Products
          </Link>
          {/* <Link to="/users" className="nav-item">
            Users
          </Link> */}
          <Link to="/orders" className="nav-item">
            Orders
          </Link>
          <Link to="/favorites" className="nav-item">
            Favorites
          </Link>
          <Link to="/contact" className="nav-item">
            Contact
          </Link>

        
          {/* Cart Icon with Item Count */}
          <Link to="/cart" className="icon-link cart-icon">
            <FaShoppingCart className="icon" />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
          <Link to="/accountsettings" className="icon-link">
            <FaUserCircle className="icon" />
          </Link>


          <div className="auth-links">
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="dropdown-menu" ref={menuRef}>
            <Link to="/dashboard" className="menu-item">
              Dashboard
            </Link>
            <Link to="/productList" className="menu-item">
              Products
            </Link>
            {/* <Link to="/users" className="menu-item">
              Users
            </Link> */}
            <Link to="/orders" className="menu-item">
              Orders
            </Link>
            <Link to="/favorites" className="menu-item">
              Favorites
            </Link>
            <Link to="/contact" className="menu-item">
              Contact
            </Link>

            {/* Cart Icon in Mobile View */}
            <Link to="/cart" className="menu-item">
              <FaShoppingCart /> Cart
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </Link>

            <Link to="/accountsettings" className="menu-item">
              <FaUserCircle /> Profile
            </Link>

            <div className="auth-links">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
