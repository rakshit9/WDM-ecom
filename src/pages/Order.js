import { useState, useEffect } from "react";
import "../styles/order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Load order history from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orderedItems")) || [];

    // ✅ Ensure `totalPrice` is included in each order
    const updatedOrders = savedOrders.map((order) => {
      const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { ...order, totalPrice: totalPrice || 0 }; // Set default if missing
    });

    setOrders(updatedOrders);
  }, []);

  return (
    <div className="order_container">
      <h2 className="order_title">Your Order History</h2>

      {orders.length > 0 ? (
        <div className="order_list">
          {orders.map((order, index) => (
            <div key={index} className="order_card">
              <h3 className="order_date">📅 Ordered on: {order.orderDate}</h3>

              {order.items.map((item) => (
                <div key={item.id} className="order_item">
                  <img src={item.image} alt={item.name} className="order_image" />
                  <div className="order_details">
                    <h4 className="order_name">{item.name}</h4>
                    <p className="order_brand"><strong>Brand:</strong> {item.brand}</p>
                    <p className="order_quantity"><strong>Quantity:</strong> {item.quantity}</p>
                    <p className="order_price"><strong>Price:</strong> ${item.price}</p>
                  </div>
                </div>
              ))}

              <div className="order_total">
                <strong>Total Amount:</strong> ${order.totalPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="order_empty">You have no past orders.</p>
      )}
    </div>
  );
}
