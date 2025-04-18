import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/analytics.css";

const Analytics = () => {
  const [summary, setSummary] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const sellerId = user?.id;
  const isAdmin = user?.isAdmin === true;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const url = `${BASE_URL}/products/sales-summary/${sellerId}?isAdmin=${isAdmin}`;
        const response = await axios.get(url);
        setSummary(response.data.sales);
      } catch (err) {
        console.error("❌ Failed to fetch summary:", err);
      }
    };

    if (sellerId) fetchSalesSummary();
  }, [sellerId, isAdmin]);

  if (!summary) return <div className="analytics-container">Loading...</div>;

  return (
    <div className="analytics-container">
      <div className="card-row">
        <div className="card">
          <p className="label">Daily Sales</p>
          <h3>${summary.day}</h3>
        </div>
        <div className="card">
          <p className="label">Weekly Sales</p>
          <h3>${summary.week}</h3>
        </div>
        <div className="card">
          <p className="label">Monthly Sales</p>
          <h3>${summary.month}</h3>
        </div>
        <div className="card">
          <p className="label">Yearly Sales</p>
          <h3>${summary.year}</h3>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
