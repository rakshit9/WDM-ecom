import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/main.css";
import axios from "axios";

const Main = () => {
  const [types, setTypes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const navigate = useNavigate();
  const sliderSettings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, centerPadding: "30px" },
      },
      { breakpoint: 768, settings: { slidesToShow: 2, centerPadding: "40px" } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerPadding: "50px" } },
    ],
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/products/filters`)
      .then((res) => setTypes(res.data.types))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/products?page=1&limit=8`) // Get all or enough products
      .then((res) => {
        setAllProducts(res.data.products);
        const shuffled = res.data.products.sort(() => 0.5 - Math.random());
        const picks = shuffled.slice(0, 10);
        console.log("Top Picks:", picks);
        setTopPicks(picks);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const categoryImages = {
    Fruit:
      "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&h=350", // 🍎 Apple, under 200 KB
    Electronics:
      "https://pbpawn.com/wp-content/uploads/2022/02/electronic-gadgets.jpeg", // 📱 Phone & laptop
    Footwear:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=350", // 👟 Sneakers
    Clothing:
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&h=350", // 👗 Hanging clothes
    Accessories:
      "https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg?auto=compress&cs=tinysrgb&h=350", // 🎒 Backpack
  };

  return (
    <div className="main">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Fresh Groceries, Delivered Instantly</h1>
          <p>
            Quality groceries at your fingertips. Experience freshness like
            never before.
          </p>
          <Link to="/productList" className="btn shop-now-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Carousel */}
      <section className="categories">
        <br />
        <br />
        <h2>Explore Our Categories</h2>
        <Slider {...sliderSettings} className="category-carousel">
          {types.map((type, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => navigate(`/productList?type=${type}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={categoryImages[type] || "https://via.placeholder.com/150"}
                alt={type}
              />
              <p>{type}</p>
            </div>
          ))}
        </Slider>
        <br />
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-home">
        <h2>Top Picks for You</h2>
        <div className="product-grid-home">
          {topPicks.map((product, index) => (
            <div key={index} className="product-card-home">
              <img
                src={
                  product.images?.[0]?.startsWith("http")
                    ? product.images[0]
                    : `${process.env.REACT_APP_BASE_URL}/api/uploads/${product.images?.[0]?.replace(/^\/?uploads\//, "")}`
                }
                alt={product.title}
                width="50"
              />

              <div className="product-info-home">
                <h3>{product.title}</h3>
                <p className="price-home">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
                <p className="brand-home">{product.brand}</p>
                <Link
                  to={`/productList?brand=${encodeURIComponent(product.brand)}`}
                  className="btn buy-btn"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="why-container">
          {/* Left Side - Title & Logo */}
          <div className="why-left">
            <h2>Why Shop With Us?</h2>
            <img src="ecommerce.png" alt="Why Choose Us" className="why-logo" />
          </div>

          {/* Right Side - Benefits Checklist */}
          <div className="why-right">
            <ul className="benefit-list">
              <li>Fast & Reliable Delivery</li>
              <li>100% Organic & Fresh Products</li>
              <li>Best Prices & Exclusive Discounts</li>
              <li>Eco-Friendly & Sustainable Packaging</li>
              <li>Easy Returns & Hassle-Free Refunds</li>
            </ul>
          </div>
        </div>
        {/* Deals & Discounts Section */}

        <section className="deals">
          <div className="deal-banner">
            <h2>Exclusive Deals & Discounts</h2>
            <p>
              Get <strong>30% Off</strong> on Your First Order!
            </p>
            <p>
              Use code: <strong>FRESH30</strong> at checkout.
            </p>
            <Link to="/productList" className="btn discount-btn">
              Claim Offer
            </Link>
          </div>
        </section>
      </section>

      {/* Customer Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <p>
              "Absolutely love the fresh produce! The delivery is always on
              time. Highly recommended!"
            </p>
            <h4>– Sarah J.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "Best grocery shopping experience. The prices are great, and the
              quality is amazing!"
            </p>
            <h4>– Mike T.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "I've never seen such fresh vegetables delivered online before.
              Five stars!"
            </p>
            <h4>– Jessica R.</h4>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}

      <section className="newsletterbg">
        <div className="newsletter">
          <h2>Stay Updated!</h2>
          <p>Subscribe to get the latest deals and offers.</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button className="btn newsletter-btn">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
