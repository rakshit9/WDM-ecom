import React, { useState } from "react";
import axios from "axios";
import "../styles/contact.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/contact`, formData);
      alert("Thank you for subscribing! Check your email.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      {/* Contact Information Section */}
      <div className="contact-info">
        <h3>Contact Us Directly</h3>
        <p>
          <strong>Email:</strong> contact@agoda.com
        </p>
        <p>
          <strong>Phone:</strong> (123) 456-7890
        </p>
      </div>
      <div className="map-container">
        <p>NH Hall, Arlington, UTA 76013</p>
        <iframe
          title="UTA Conference Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.3130214450934!2d-97.11652718481535!3d32.731228180975775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e7ded58b5282f%3A0x86a3cfcf8f63f5ff!2sNH%20Hall%2C%20University%20of%20Texas%20at%20Arlington%2C%20Arlington%2C%20TX%2076013%2C%20USA!5e0!3m2!1sen!2sin!4v1649078607593!5m2!1sen!2sin"
          width="100%"
          height="300"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
