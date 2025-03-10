import React from "react";
import { Link } from "react-router-dom";
import "../styles/orderConfirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="order-confirmation">
      <h2>Order Confirmed 🎉</h2>
      <p>Your order has been placed successfully.</p>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
};

export default OrderConfirmation;
