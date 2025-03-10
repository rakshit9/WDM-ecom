import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/main.css";

const Main = () => {
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

  const categories = [
    {
      img: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
      name: "Fresh Fruits",
      price: "$5.99/kg",
    },
    {
      img: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
      name: "Organic Vegetables",
      price: "$2.99/kg",
    },
    {
      img: "https://images.pexels.com/photos/31012757/pexels-photo-31012757.jpeg",
      name: "Dairy Products",
      price: "$2.99/gl",
    },
    {
      img: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
      name: "Bakery & Breads",
      price: "$6.99/peice",
    },
    {
      img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg",
      name: "Fresh Meat",
      price: "$12.79/kg",
    },
    {
      img: "https://images.pexels.com/photos/1582482/pexels-photo-1582482.jpeg",
      name: "Healthy Snacks",
      price: "$1.99/pack",
    },
    {
      img: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg",
      name: "Beverages",
      price: "$8.99/bottle",
    },
  ];

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
        <h2>Explore Our Categories</h2>
        <Slider {...sliderSettings} className="category-carousel">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <img src={category.img} alt={category.name} />
              <p>{category.name}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-home">
        <h2>Top Picks for You</h2>
        <div className="product-grid-home">
          {categories.map((product, index) => (
            <div key={index} className="product-card-home">
              <img src={product.img} alt={product.name} />
              <div className="product-info-home">
                <h3>{product.name}</h3>
                <p className="price-home">{product.price}</p>
                <Link to="/productList" className="btn buy-btn">
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
