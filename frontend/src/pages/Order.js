import { useState, useEffect } from "react";
import "../styles/order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) return;

    setUser(parsedUser);
    fetchOrders(parsedUser.id);
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/orders/${userId}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("❌ Failed to fetch orders:", error);
    }
  };

  const handleInputChange = (orderId, value) => {
    setReviewInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (orderId, value) => {
    setRatings((prev) => ({ ...prev, [orderId]: value }));
  };

  const submitReview = async (order) => {
    const userReview = reviewInputs[order.orderId]?.trim();
    const rating = ratings[order.orderId];

    if (!userReview || rating == null) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/orders/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: order.product.productId,
          orderId: order.orderId,
          userReview,
          rating,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Review submitted!");
        window.location.reload(); // reload the entire page to refresh orders and reviews
      } else {
        alert(data.message || "Review failed");
      }
    } catch (err) {
      console.error("❌ Failed to submit review:", err);
    }
  };

  return (
    <div className="order_container">
      <h2 className="order_title">Your Order History</h2>

      {orders.length > 0 ? (
        <div className="order_list">
          {orders.map((group, index) => (
            <div key={index} className="order_group">
              <h3 className="order_date">
                📅 Ordered on: {new Date(group.orderDate).toLocaleDateString()}
              </h3>

              {group.orders.map((order) => (
                <div key={order.orderId} className="order_item enhanced">

                  <img
                  src={
                    order.product.images[0].startsWith("http")
                        ? order.product.images[0]
                        :`${process.env.REACT_APP_BASE_URL}${order.product.images[0]}`
                  }
                   className="order_image"
                   alt={order.product.title}
 
                      />                
  
                  <div className="order_details">
                    <h4 className="order_name">🛍 {order.product.title}</h4>
                    <p className="order_brand"><strong>Brand:</strong> {order.product.brand}</p>
                    <p className="order_quantity"><strong>Quantity:</strong> {order.quantity}</p>
                    <p className="order_price"><strong>Price:</strong> ${order.product.price}</p>
                    <p className="order_subtotal"><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>

                    <div className="review_input">
                      <div className="review_rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const currentRating = ratings[order.orderId] ?? order.rating ?? 0;
                          return (
                            <span
                              key={star}
                              className={`star ${currentRating >= star ? "filled" : ""}`}
                              onClick={() => handleRatingChange(order.orderId, star)}
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>
                      <textarea
                        placeholder="Leave or edit your review..."
                        className="review_textarea"
                        value={reviewInputs[order.orderId] ?? order.review ?? ""}
                        onChange={(e) => handleInputChange(order.orderId, e.target.value)}
                      ></textarea>
                      <button
                        className="review_button"
                        onClick={() => submitReview(order)}
                      >
                        {order.review ? "Update Review" : "Submit Review"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="order_summary">
                <p><strong>Total Orders:</strong> {group.totalOrders}</p>
                <p><strong>Tax:</strong> ${group.tax}</p>
                <p><strong>Delivery Fee:</strong> ${group.deliveryFee}</p>
                <p><strong>Grand Total:</strong> ${group.grandTotal}</p>
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
