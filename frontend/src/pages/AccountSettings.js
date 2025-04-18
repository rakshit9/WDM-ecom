import React, { useState, useEffect } from "react";
import "../styles/accountsettings.css";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailNotifications: true,
    smsNotifications: false,
  });

  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setFormData((prev) => ({
          ...prev,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
        }));

        setAddress({
          addressLine1: user.addressLine1 || "",
          addressLine2: user.addressLine2 || "",
          city: user.city || "",
          state: user.state || "",
          postalCode: user.postalCode || "",
          country: user.country || "",
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in address) {
      setAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.id) {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/users/address/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(address),
        });

        const data = await res.json();
        if (res.ok) {
          const updatedUser = { ...user, ...data.address };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          alert("✅ Settings and address updated successfully!");
        } else {
          alert(data.message || "❌ Failed to update address");
        }
      } catch (err) {
        console.error("❌ Address update error:", err);
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>

      <form onSubmit={handleSubmit}>
        {/* Profile Details */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <h2>Address</h2>
        <div className="form-group">
          <label>Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Notification Preferences</h2>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
          />
          <label>Receive Email Notifications</label>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="smsNotifications"
            checked={formData.smsNotifications}
            onChange={handleChange}
          />
          <label>Receive SMS Notifications</label>
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
