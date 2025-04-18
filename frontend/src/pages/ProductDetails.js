import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/productDetails.css";

const placeholderImages = [
  "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
  "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg",
  "https://images.pexels.com/photos/1582482/pexels-photo-1582482.jpeg",
  "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
];

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratingData, setRatingData] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${productId}`);
        setProduct(res.data);
        setSelectedImage(res.data.images?.[0] || placeholderImages[0]);
      } catch (err) {
        console.error("Failed to fetch product details", err);
        toast.error("Failed to fetch product details");
      }
    };

    const fetchRatings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/rating-summary/${productId}`);
        setRatingData(res.data);
      } catch (err) {
        console.error("Failed to fetch rating summary", err);
      }
    };

    const fetchRecommended = async () => {
      const random = Math.floor(Math.random() * 10);
      try {
        const res = await axios.get(`${BASE_URL}/products?limit=6&page=${random}`);
        setRecommendedProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch recommended products", err);
      }
    };

    fetchProduct();
    fetchRatings();
    fetchRecommended();
  }, [productId, BASE_URL]);

  const toggleFavorite = async () => {
    if (!userId) {
      toast.error("Please login to save products");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/favorites/toggle`, {
        userId,
        productId: parseInt(productId),
      });

      setIsFavorite((prev) => !prev);
      toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      console.error("❌ Failed to toggle favorite:", err);
      toast.error("Favorite action failed");
    }
  };

  const handleAddToCart = async (id = productId, qty = quantity) => {
    if (!userId) {
      toast.error("You must be logged in to add items to cart.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/checkout/add`, {
        userId,
        productId: parseInt(id),
        quantity: qty,
      });

      toast.success("Product added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      toast.error("Failed to add product to cart");
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const renderStars = (rating) => (
    <span>
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );

  if (!product) return <div className="product_details-wrapper">Loading...</div>;

  return (
    <div className="product_details-wrapper">
      <div className="product_details-container">
        <div className="product_images">
          <div className="product_thumbnail-container">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={
                  (image).startsWith("http")   ? image : `${process.env.REACT_APP_BASE_URL}${image}`
                }
                alt={`Thumbnail ${index}`}
                className={`product_thumbnail ${selectedImage === image ? "product_active" : ""}`}
                onClick={() => setSelectedImage(image)}
                />

           

            ))}
          </div>
          
          <img
            src={
              (selectedImage).startsWith("http")   ? selectedImage : `${process.env.REACT_APP_BASE_URL}${selectedImage}`
            }
          alt="Product Preview" className="product_large-image" />
        </div>

        <div className="product_info">
          <h2 className="product_title">{product.title}</h2>
          <p className="product_description">{product.description}</p>
          <p className="product_price">
            <strong>Price:</strong> ${product.price}
          </p>

          <div className="product_rating">
            {ratingData ? (
              <>
                <div className="product_stars">{renderStars(Math.round(ratingData.averageRating))}</div>
                <span className="product_rating-score">{ratingData.averageRating}</span>
                <span className="product_total-reviews">({ratingData.totalReviews} Reviews)</span>
              </>
            ) : (
              <span>Loading ratings...</span>
            )}
          </div>

          <div className="product_favorite-info">
            <button
              className={`product_favorite-button ${isFavorite ? "product_favorited" : ""}`}
              onClick={toggleFavorite}
            >
              <Heart size={22} />
            </button>
            <span className="product_favorite-text">Save for later and get quick access to this product.</span>
          </div>

          <div className="product_quantity-container">
            <button className="product_quantity-btn" onClick={decreaseQuantity}>-</button>
            <span className="product_quantity-value">{quantity}</span>
            <button className="product_quantity-btn" onClick={increaseQuantity}>+</button>
          </div>

          <div className="product_action-buttons">
            <button className="product_add-to-cart-button" onClick={() => handleAddToCart()}>
              🛒 Add to Cart
            </button>
          </div>

          {ratingData?.reviews?.length > 0 && (
            <div className="product_reviews-section">
              <h3 className="product_reviews-title">Customer Reviews</h3>
              {ratingData.reviews.map((r, idx) => (
                <div key={idx} className="product_review">
                  <div className="product_review-header">
                    <div className="product_review-stars">{renderStars(r.rating)}</div>
                    <span className="product_review-user">{r.user}</span>
                    <span className="product_review-date">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <p className="product_review-text">{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Recommended Section */}
      <div className="product_details-recommended">
        <h3 className="product_details-recommended-title">Recommended Products</h3>
        <div className="product_details-scroll-container">
          {recommendedProducts.map((rec) => (
            <div className="product_details-card" key={rec.productId}>
              <img src={rec.images[0]} alt={rec.title} className="product_details-image" />
              <h4 className="product_details-name">{rec.title}</h4>
              <p className="product_details-brand"><strong>Brand:</strong> {rec.brand}</p>
              <p className="product_details-description">{rec.description}</p>
              <p className={`product_details-availability ${rec.availableQty === 0 ? "out-of-stock" : ""}`}>
                <strong>Availability:</strong> {rec.availableQty === 0 ? "Out of Stock" : rec.availableQty < 10 ? "Limited Stock" : "In Stock"}
              </p>
              <p className="product_details-price"><strong>Price:</strong> ${rec.price}</p>
              <button
                className="product_details-add-to-cart"
                onClick={() => handleAddToCart(rec.productId, 1)}
                disabled={rec.availableQty === 0}
              >
                {rec.availableQty === 0 ? "Out of Stock" : "🛒 Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
