import { useState, useEffect } from "react";
import "../styles/orderConfirmation.css";
import products from "../constant/constants"; // Import products data

export default function OrderConfirmation() {
  const [orderItems, setOrderItems] = useState([]);

  // Load cart items (id & quantity) and match them with product details from `products.js`
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Map each cart item to its full product details
    const updatedOrders = savedCart
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        return product ? { ...product, quantity: cartItem.items } : null;
      })
      .filter((item) => item !== null); // Remove null items (if product ID not found)

    setOrderItems(updatedOrders);
  }, []);

  // Calculate total price
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Generate order date
  const getOrderDate = () => {
    const now = new Date();
    return now.toLocaleString(); // Example: "3/10/2025, 2:35:21 PM"
  };

  // Handle Payment Process (Move from cartItems to orderedItems)
  const handlePayment = () => {
    if (orderItems.length === 0) {
      alert("Your order is empty. Please add items to proceed.");
      return;
    }

    // Retrieve previous orders from localStorage or create a new order list
    const previousOrders = JSON.parse(localStorage.getItem("orderedItems")) || [];

    // Create a new order with a timestamp
    const newOrder = {
      orderDate: getOrderDate(),
      items: orderItems
    };

    // Merge previous orders with new order
    const updatedOrders = [...previousOrders, newOrder];

    // Save new order list in `orderedItems` localStorage
    localStorage.setItem("orderedItems", JSON.stringify(updatedOrders));

    // Clear cart after payment
    localStorage.removeItem("cartItems");
    setOrderItems([]);

    alert("Payment successful! Your order has been placed.");
  };

  return (
    <div className="order_container">
      <h2>Order Confirmation</h2>

      {/* Order Items */}
      <div className="order_items">
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <div key={item.id} className="order_item">
              <img src={item.image} alt={item.name} className="order_item-image" />
              <div className="order_item-details">
                <h4 className="order_item-name">{item.name}</h4>
                <p className="order_item-price"><strong>Price:</strong> ${item.price}</p>
                <p className="order_item-quantity"><strong>Quantity:</strong> {item.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="order_empty">Your cart is empty. Add items to continue.</p>
        )}
      </div>

      {/* Order Summary and Payment */}
      {orderItems.length > 0 && (
        <div className="order_summary">
          <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
          <button className="order_pay-button" onClick={handlePayment}>Pay Now</button>
        </div>
      )}
    </div>
  );
}
