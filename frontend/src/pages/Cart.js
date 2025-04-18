import { useState, useEffect } from "react";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCheckout = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/checkout/${user.id}`);
      const data = await res.json();
      setCartItems(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error("❌ Failed to fetch checkout items:", err);
    }
  };

  useEffect(() => {
    fetchCheckout();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/checkout/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, quantity: newQuantity }),
      });

      const data = await res.json();
      if (res.ok) fetchCheckout();
      else alert(data.message || "Update failed");
    } catch (err) {
      console.error("❌ Update quantity failed:", err);
    }
  };

  const deleteItem = async (productId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/checkout/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });

      const data = await res.json();
      if (res.ok) fetchCheckout();
      else alert(data.message || "Delete failed");
    } catch (err) {
      console.error("❌ Delete item failed:", err);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/order-confirmation");
  };

  return (
    <div className="cart_container">
      <h2>Your Shopping Cart</h2>

      <div className="cart_items">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.productId} className="cart_item">
              <img src={item.image} alt={item.title} className="cart_item-image" />
              <div className="cart_item-details">
                <h4 className="cart_item-name">{item.title}</h4>
                <p className="cart_item-brand"><strong>Brand:</strong> {item.brand}</p>
                <p className="cart_item-price"><strong>Price:</strong> ${item.price}</p>
                <div className="cart_item-quantity">
                  <strong>Quantity:</strong>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <p className="cart_item-subtotal"><strong>Subtotal:</strong> ${item.subtotal.toFixed(2)}</p>
                <button className="cart_item-delete" onClick={() => deleteItem(item.productId)}>🗑️ Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p className="cart_empty">Your cart is empty!</p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart_summary">
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          <button className="cart_buy-button" onClick={proceedToCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
