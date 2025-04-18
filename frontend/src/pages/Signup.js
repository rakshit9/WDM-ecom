import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    roleType: "", // Optional — defaults to "customer" on backend
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't send empty roleType so backend can use its default
    const payload = { ...formData };
    if (!formData.roleType) delete payload.roleType;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/signup`, // ✅ using .env variable
        payload
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Create Your Account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="signup-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="signup-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="signup-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="signup-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="signup-input"
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <select
              name="roleType"
              value={formData.roleType}
              onChange={handleChange}
              className="signup-input"
            >
              <option value="">Select Role (Optional)</option>
              <option value="seller">Seller</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
        <div className="login-links">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
