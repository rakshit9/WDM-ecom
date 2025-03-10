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
    },
    {
      img: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
      name: "Organic Vegetables",
    },
    {
      img: "https://images.pexels.com/photos/31012757/pexels-photo-31012757.jpeg",
      name: "Dairy Products",
    },
    {
      img: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
      name: "Bakery & Breads",
    },
    {
      img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg",
      name: "Fresh Meat",
    },
    {
      img: "https://images.pexels.com/photos/1582482/pexels-photo-1582482.jpeg",
      name: "Healthy Snacks",
    },
    {
      img: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg",
      name: "Beverages",
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
          <Link to="/shop" className="btn shop-now-btn">
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

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why Shop With Us?</h2>
        <div className="benefits">
          <div className="benefit-card">🚀 Fast Delivery</div>
          <div className="benefit-card">🥗 100% Organic</div>
          <div className="benefit-card">💰 Best Prices</div>
          <div className="benefit-card">🌎 Eco-Friendly Packaging</div>
          <div className="benefit-card">🔄 Easy Returns</div>
        </div>
      </section>

      {/* Deals & Discounts Section */}
      <section className="deals">
        <div className="deal-banner">
          <h2>Exclusive Deals & Discounts</h2>
          <br />
          <h3>Get 30% Off on Your First Order!</h3>
          <p>
            Use code: <strong>FRESH30</strong> at checkout.
          </p>
          <br />
          <Link to="/shop" className="btn discount-btn">
            Claim Offer
          </Link>
        </div>
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
    </div>
  );
};

export default Main;
