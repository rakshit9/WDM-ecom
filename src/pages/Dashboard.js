import React, { useState } from "react";
import "../styles/dashboard.css";
import Products from "../components/Products";
import Users from "../components/Users";
import Analytics from "../components/Analytics";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home");
  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <h2>Welcome to Dashboard</h2>;
      case "users":
        return <Users />;
      case "products":
        return <Products />;
      case "analytics":
        return <Analytics />;
      default:
        return <h2>Welcome to Dashboard</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dsidebar">
        <nav>
          <ul>
            <li>
              <Link to="/dashboard" onClick={() => setActiveComponent("home")}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/users"
                onClick={() => setActiveComponent("users")}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/products"
                onClick={() => setActiveComponent("products")}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/analytics"
                onClick={() => setActiveComponent("analytics")}
              >
                Analytics
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">{renderComponent()}</div>
    </div>
  );
};

export default Dashboard;
