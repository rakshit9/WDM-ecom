import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/header.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const getCartItemCount = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.id) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/checkout/${storedUser.id}`);
      const data = await res.json();
      setCartItemCount(data.items?.length || 0);
    } catch (error) {
      console.error("❌ Failed to fetch cart item count:", error);
    }
  };

  useEffect(() => {
    getCartItemCount();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    setIsLoggedIn(!!token);
    setUserRole(
      user?.isAdmin
        ? "admin"
        : user?.role || "customer"
    );
    const interval = setInterval(getCartItemCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productList?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole("customer");
    navigate("/"); // ✅ Redirect to home page after logout
  };

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
        <Link to="/" className="logo">AGODA</Link>

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

        <nav className="nav-links">
          {(userRole === "admin" || userRole === "seller") && (
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
          )}

          <Link to="/productList" className="nav-item">Products</Link>
          <Link to="/orders" className="nav-item">Orders</Link>
          <Link to="/favorites" className="nav-item">Favorites</Link>
          <Link to="/contact" className="nav-item">Contact</Link>

          <Link to="/accountsettings" className="icon-link">
            <FaUserCircle className="icon" />
          </Link>

          <Link to="/cart" className="icon-link cart-icon">
            <FaShoppingCart className="icon" />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </nav>

        <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {menuOpen && (
          <div className="dropdown-menu" ref={menuRef}>
            {userRole !== "customer" && <Link to="/dashboard" className="menu-item">Dashboard</Link>}
            <Link to="/productList" className="menu-item">Products</Link>
            <Link to="/orders" className="menu-item">Orders</Link>
            <Link to="/favorites" className="menu-item">Favorites</Link>
            <Link to="/contact" className="menu-item">Contact</Link>

            <Link to="/cart" className="menu-item">
              <FaShoppingCart /> Cart
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>

            <Link to="/accountsettings" className="menu-item">
              <FaUserCircle /> Profile
            </Link>

            {isLoggedIn ? (
                <div className="auth-links">
              <button className="menu-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/signup" className="signup-btn">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
