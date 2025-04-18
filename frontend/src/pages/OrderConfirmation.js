import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderConfirmation.css";

export default function OrderConfirmation() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [userAddress, setUserAddress] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [addressForm, setAddressForm] = useState({});
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrderConfirmation = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/orders/confirmation/${user.id}`
        );
        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        console.error("❌ Failed to fetch order confirmation:", err);
      } finally {
        setLoading(false);
      }
    };

    const loadUserAddress = () => {
      const {
        addressLine1 = "",
        addressLine2 = "",
        city = "",
        state = "",
        postalCode = "",
        country = "",
      } = user;
      const address = {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      };
      setUserAddress(address);
      setAddressForm(address);
    };

    fetchOrderConfirmation();
    loadUserAddress();
  }, [user?.id]);

  const handleAddressEditToggle = () => setEditMode(!editMode);

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users/address/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        }
      );

      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...user, ...data.address };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserAddress(data.address);
        setEditMode(false);
      } else {
        alert(data.message || "Failed to update address");
      }
    } catch (err) {
      console.error("❌ Address update error:", err);
    }
  };

  const submitCardAndPlaceOrder = async () => {
    if (!selectedCard) {
      alert("Please select a payment method.");
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/orders/place`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Order placed successfully!");
        navigate("/orders");
      } else {
        alert(data.message || "❌ Failed to place order");
      }
    } catch (err) {
      console.error("❌ Order placement error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="order_container">Loading...</div>;
  if (!orderData || !Array.isArray(orderData.items)) {
    return (
      <div className="order_container">
        <p className="order_empty">Your cart is empty or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="order_container">
      <h2>Order Confirmation</h2>

      <div className="order_address centered">
        <div className="address_header">
          <h3>Your Location</h3>
          <button className="edit-btn" onClick={handleAddressEditToggle}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editMode ? (
          <>
            <p>{userAddress.addressLine1}</p>
            {userAddress.addressLine2 && <p>{userAddress.addressLine2}</p>}
            <p>
              {userAddress.city}, {userAddress.state} {userAddress.postalCode}
            </p>
            <p>{userAddress.country}</p>
          </>
        ) : (
          <div className="edit-form">
            <input
              name="addressLine1"
              value={addressForm.addressLine1}
              onChange={handleAddressInputChange}
              placeholder="Address Line 1"
            />
            <input
              name="addressLine2"
              value={addressForm.addressLine2}
              onChange={handleAddressInputChange}
              placeholder="Address Line 2"
            />
            <input
              name="city"
              value={addressForm.city}
              onChange={handleAddressInputChange}
              placeholder="City"
            />
            <input
              name="state"
              value={addressForm.state}
              onChange={handleAddressInputChange}
              placeholder="State"
            />
            <input
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleAddressInputChange}
              placeholder="Postal Code"
            />
            <input
              name="country"
              value={addressForm.country}
              onChange={handleAddressInputChange}
              placeholder="Country"
            />
            <button className="save-btn" onClick={handleAddressSubmit}>
              Save Address
            </button>
          </div>
        )}
      </div>

      <div className="order_items">
        {orderData.items.map((item) => (
          <div key={item.productId} className="order_item">
            <img
              key={item.image}
              src={
                item.image.startsWith("http")
                  ? item.image
                  : `${process.env.REACT_APP_BASE_URL}${item.image}`
              }
              alt={item.title}
              className="order_item-image"
            />
            <div className="order_item-details">
              <h4 className="order_item-name">{item.title}</h4>
              <p className="order_item-brand">
                <strong>Brand:</strong> {item.brand}
              </p>
              <p className="order_item-price">
                <strong>Price:</strong> ${item.price}
              </p>
              <p className="order_item-quantity">
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="order_item-subtotal">
                <strong>Subtotal:</strong> ${item.subtotal.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="order_summary">
        <p>
          <strong>Total Before Tax:</strong> $
          {orderData.totalBeforeTax.toFixed(2)}
        </p>
        <p>
          <strong>Tax (8.5%):</strong> ${orderData.tax.toFixed(2)}
        </p>
        <p>
          <strong>Delivery Fee:</strong> ${orderData.deliveryFee.toFixed(2)}
        </p>
        <p>
          <strong>Grand Total:</strong> ${orderData.grandTotal.toFixed(2)}
        </p>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <label
            className={`payment-option ${
              selectedCard === "visa" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="visa"
              checked={selectedCard === "visa"}
              onChange={(e) => setSelectedCard(e.target.value)}
            />
            <div className="card-info">
              <span>**** 5724</span>
              <small>Visa | Edit</small>
            </div>
            <span className="brand-logo">VISA</span>
          </label>

          <label
            className={`payment-option ${
              selectedCard === "mastercard" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="mastercard"
              checked={selectedCard === "mastercard"}
              onChange={(e) => setSelectedCard(e.target.value)}
            />
            <div className="card-info">
              <span>**** 9630</span>
              <small>Mastercard | Edit</small>
            </div>
            <span className="brand-logo">Mastercard</span>
          </label>

          <label
            className={`payment-option ${
              selectedCard === "gpay" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="gpay"
              checked={selectedCard === "gpay"}
              onChange={(e) => setSelectedCard(e.target.value)}
            />
            <div className="card-info">
              <span>Google Pay</span>
              <small>Fast checkout</small>
            </div>
            <span className="brand-logo">GPay</span>
          </label>
        </div>

        <button
          className="order_pay-button"
          onClick={submitCardAndPlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
