import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/productsList.css";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState(150);
  const [priceRangeData, setPriceRangeData] = useState({ min: 0, max: 150 });
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showSpecialOffers, setShowSpecialOffers] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const typeFromUrl = searchParams.get("type") || "";

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        if (!user?.id) return;

        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/favorites/${user.id}`
        );
        const data = await res.json();
        const productIds = data.favorites.map((product) => product.productId);
        setFavoriteProducts(productIds);
      } catch (err) {
        console.error("❌ Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/products/filters?q=${query}`
      );
      const data = await res.json();
      setAvailableBrands(data.brands);
      setAvailableTypes(data.types);
      setPriceRangeData(data.priceRange);
      setPriceRange(data.priceRange.max);
    };
    fetchFilters();
  }, [query]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 15);
      if (query) params.append("search", query);
      if (typeFromUrl) params.append("type", typeFromUrl);
      if (priceRange < priceRangeData.max)
        params.append("maxPrice", priceRange);
      if (availabilityFilter === "in-stock") params.append("inStock", "true");
      if (availabilityFilter === "out-of-stock")
        params.append("inStock", "false");
      if (selectedBrands.length > 0)
        selectedBrands.forEach((b) => params.append("brand", b));

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/products?${params.toString()}`
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [
    query,
    typeFromUrl,
    currentPage,
    selectedBrands,
    priceRange,
    availabilityFilter,
  ]);

  const toggleFavorite = async (e, productId) => {
    e.stopPropagation();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to manage favorites.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user?.id) {
      alert("Invalid user data. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/favorites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId }),
        }
      );

      const data = await res.json();

      if (data.message.includes("added")) {
        setFavoriteProducts((prev) => [...prev, productId]);
      } else {
        setFavoriteProducts((prev) => prev.filter((id) => id !== productId));
      }
    } catch (error) {
      console.error("❌ Favorite toggle failed:", error);
    }
  };

  const addToCart = async (e, id) => {
    e.stopPropagation();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/checkout/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId: id, quantity: 1 }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Added to checkout successfully!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      alert("An error occurred while adding to cart.");
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="product-list-container">
      <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
        <SlidersHorizontal className="filter-icon" /> Filters
      </button>

      <aside className={`filter-panel ${isFilterOpen ? "open" : ""}`}>
        <h3>Filter by Brand</h3>
        {availableBrands.map((brand) => (
          <label key={brand} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
            />
            {brand}
          </label>
        ))}

        <h3>Availability</h3>
        <label className="filter-radio">
          <input
            type="radio"
            name="availability"
            value="all"
            checked={availabilityFilter === "all"}
            onChange={() => setAvailabilityFilter("all")}
          />{" "}
          All
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="availability"
            value="in-stock"
            checked={availabilityFilter === "in-stock"}
            onChange={() => setAvailabilityFilter("in-stock")}
          />{" "}
          In Stock
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="availability"
            value="out-of-stock"
            checked={availabilityFilter === "out-of-stock"}
            onChange={() => setAvailabilityFilter("out-of-stock")}
          />{" "}
          Out of Stock
        </label>
      </aside>

      <div className="product-section">
        <section className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.productId}
                className="product-card"
                onClick={() => navigate(`/product/${product.productId}`)}
              >
                <button
                  className={`favorite-button ${
                    favoriteProducts.includes(product.productId)
                      ? "favorited"
                      : ""
                  }`}
                  onClick={(e) => toggleFavorite(e, product.productId)}
                >
                  <Heart size={20} />
                </button>
               

                <img
                  src={
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0].startsWith("http")
                        ? product.images[0]
                        : `${process.env.REACT_APP_BASE_URL}${product.images[0]}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={product.title}
                  className="product-image"
                />

                <h4 className="product-name">{product.title}</h4>
                <p className="product-brand">
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p className="product-description">{product.description}</p>
                <p
                  className={`product-availability ${
                    product.availableQty === 0 ? "out-of-stock" : ""
                  }`}
                >
                  <strong>Availability:</strong>{" "}
                  {product.availableQty > 0 ? "In Stock" : "Out of Stock"}
                </p>
                <p className="product-price">
                  <strong>Price:</strong> ${product.price}
                </p>
                <button
                  className="add-to-cart"
                  disabled={product.availableQty === 0}
                  onClick={(e) => addToCart(e, product.productId)}
                >
                  {product.availableQty === 0
                    ? "Out of Stock"
                    : "🛒 Add to Cart"}
                </button>
              </div>
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </section>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              <ChevronLeft /> Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
