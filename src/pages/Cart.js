import { useState, useEffect } from "react";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";
import products from "../constant/constants"; // Import products from constants

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  // Load cart data from localStorage and map with product details
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = savedCart
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        return product ? { ...product, quantity: cartItem.items } : null;
      })
      .filter((item) => item !== null); // Remove null entries if product not found

    setCartItems(updatedCart);
  }, []); // Runs only once when component mounts

  // Function to update cart in localStorage
  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart.map(({ id, quantity }) => ({ id, items: quantity })))
    );
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Remove item from cart (Update UI and localStorage)
  const removeFromCart = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/order-confirmation"); // Navigate to order confirmation page
  };


  return (
    <div className="cart_container">
      <h2>Your Shopping Cart</h2>

      {/* Cart Items */}
      <div className="cart_items">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart_item">
              <img src={item.image} alt={item.name} className="cart_item-image" />
              <div className="cart_item-details">
                <h4 className="cart_item-name">{item.name}</h4>
                <p className="cart_item-description">{item.description}</p>
                <p className="cart_item-price"><strong>Price:</strong> ${item.price}</p>

                {/* Quantity Selector */}
                <div className="cart_item-quantity">
                  <button className="cart_quantity-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="cart_quantity-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                
                <button className="cart_remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p className="cart_empty">Your cart is empty!</p>
        )}
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="cart_summary">
          <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
          <button className="cart_buy-button" onClick={proceedToCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
