import React from 'react'
import { Link } from 'react-router-dom'

import "../styles/sidebar.css";
const Sidebar = ({ setActiveComponent }) => {
  return (
<div className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/dashboard" onClick={() => setActiveComponent('home')}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard/users" onClick={() => setActiveComponent('users')}>
                Users
              </Link>
            </li>
            <li>
              <Link to="/dashboard/products" onClick={() => setActiveComponent('products')}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/dashboard/analytics" onClick={() => setActiveComponent('analytics')}>
                Analytics
              </Link>
            </li>
          </ul>
        </nav>
      </div>
  )
}

export default Sidebar