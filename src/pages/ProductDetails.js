import { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import "../styles/productDetails.css";
import products from "../constant/constants"; // Adjust path if needed

// Placeholder images for now
const placeholderImages = [
  "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=3087&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536632856133-3a3441454dd5?q=80&w=3087&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586861642026-74a6da22a3cd?q=80&w=3088&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=3085&auto=format&fit=crop",
];

export default function ProductDetails({ selectedProduct }) {
  const product = selectedProduct || {
    id:2,
    name: "Luxury Modern Product",
    description:
      "A premium product with exceptional design and top-notch quality.",
    price: 89.99,
    images: placeholderImages,
    brand: "Brand B",
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const similarProducts = products.filter(
      (p) => p.brand === product.brand && p.id !== product.id
    );
    setRecommendedProducts(similarProducts);
  }, [product]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  return (
    <div className="product_details-wrapper">
      {/* Product Details Section */}
      <div className="product_details-container">
        {/* Left Side: Product Images */}
        <div className="product_images">
          <div className="product_thumbnail-container">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className={`product_thumbnail ${
                  selectedImage === image ? "product_active" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
          <img
            src={selectedImage}
            alt="Product Preview"
            className="product_large-image"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="product_info">
          <h2 className="product_title">{product.name}</h2>
          <p className="product_description">{product.description}</p>
          <p className="product_price">
            <strong>Price:</strong> ${product.price}
          </p>

          <div className="product_rating">
    <div className="product_stars">⭐⭐⭐⭐⭐</div>
    <span className="product_rating-score">4.7</span>
    <span className="product_total-reviews">(128 Reviews)</span>
  </div>
 {/* Why Favorite? Section */}
      <div className="product_favorite-info">
          <button
            className={`product_favorite-button ${isFavorite ? "product_favorited" : ""}`}
            onClick={toggleFavorite}
          >
            <Heart size={22} />
          </button>
          <span className="product_favorite-text">Save for later and get quick access to this product.</span>
        </div>

        
          {/* Quantity Selector */}
          <div className="product_quantity-container">
            <button className="product_quantity-btn" onClick={decreaseQuantity}>
              -
            </button>
            <span className="product_quantity-value">{quantity}</span>
            <button className="product_quantity-btn" onClick={increaseQuantity}>
              +
            </button>
          </div>

          {/* Favorite and Action Buttons */}
          <div className="product_action-buttons">
            <button className="product_add-to-cart-button">
              🛒 Add to Cart
            </button>
            <button className="product_buy-now-button">💳 Buy Now</button>
          </div>

        </div>
      </div>
      {/* Recommended Products Section */}
      <div className="product_details-recommended">
        <h3 className="product_details-recommended-title">Recommended Products</h3>
        <div className="product_details-recommended-list">
          {recommendedProducts.length > 0 ? (
            <div className="product_details-scroll-container">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="product_details-card">
                  <button className={`product_details-favorite-button ${isFavorite ? "product_details-favorited" : ""}`} onClick={() => toggleFavorite(product.id)}>
                    <Heart size={20} />
                  </button>
                  <img src={product.image} alt={product.name} className="product_details-image" />
                  <h4 className="product_details-name">{product.name}</h4>
                  <p className="product_details-brand"><strong>Brand:</strong> {product.brand}</p>
                  <p className="product_details-description">{product.description}</p>
                  <p className={`product_details-availability ${product.availability === "Out of Stock" ? "out-of-stock" : ""}`}>
                    <strong>Availability:</strong> {product.availability}
                  </p>
                  {product.specialOffer && <p className="product_details-offer">🎉 {product.specialOffer}</p>}
                  <p className="product_details-price"><strong>Price:</strong> ${product.price}</p>
                  <button className="product_details-add-to-cart" disabled={product.availability === "Out of Stock"}>
                    {product.availability === "Out of Stock" ? "Out of Stock" : "🛒 Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="product_details-no-recommendations">No similar products found.</p>
          )}
        </div>
      </div>


    </div>
  );
}
