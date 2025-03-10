import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/productsList.css";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// Generate Products
const products = Array.from({ length: 70 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  brand: `Brand ${String.fromCharCode(65 + (index % 3))}`, 
  price: Math.floor(Math.random() * 100) + 20,
  description: "High-quality product with great performance.",
  availability: index % 5 === 0 ? "Out of Stock" : index % 3 === 0 ? "Limited Stock" : "In Stock",
  specialOffer: index % 4 === 0 ? "10% Off" : index % 6 === 0 ? "Buy 1 Get 1 Free" : null,
  image: "https://i5.walmartimages.com/seo/Fresh-Whole-Yellow-Onion-Each.jpeg"
}));

// Extract unique brand names
const uniqueBrands = [...new Set(products.map((product) => product.brand))];

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(150);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showSpecialOffers, setShowSpecialOffers] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // 🛑 Load favorite products from local storage
  const [favoriteProducts, setFavoriteProducts] = useState(() => {
    const savedFavorites = localStorage.getItem("favoriteProducts");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // 💾 Save favorites to local storage when it changes
  useEffect(() => {
    localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
  }, [favoriteProducts]);


  const addToCart = (productId) => {
    try {
      // Retrieve cart from localStorage or initialize an empty array
      let existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

      // Find if the product already exists in the cart
      const productIndex = existingCart.findIndex((item) => item.id === productId);

      if (productIndex !== -1) {
        // Product exists, increase quantity
        existingCart[productIndex].items += 1;
      } else {
        // Product doesn't exist, add it with quantity 1
        existingCart.push({ id: productId, items: 1 });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(existingCart));

      // Debugging: Console log to verify
      console.log("Cart Updated:", existingCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // ⭐ Toggle favorite product
  const toggleFavorite = (productId) => {
    setFavoriteProducts((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId) // Remove favorite
        : [...prevFavorites, productId] // Add favorite
    );
  };

  // 🛒 Handle Brand Filter
  const handleBrandChange = (brand) => {
    setSelectedBrands((prevBrands) =>
      prevBrands.includes(brand) ? prevBrands.filter((b) => b !== brand) : [...prevBrands, brand]
    );
  };

  // 🔍 Filter Products
  const filteredProducts = products.filter(
    (product) =>
      product.price <= priceRange &&
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
      (availabilityFilter === "all" ||
        (availabilityFilter === "in-stock" && product.availability !== "Out of Stock") ||
        (availabilityFilter === "out-of-stock" && product.availability === "Out of Stock")) &&
      (!showSpecialOffers || product.specialOffer)
  );

  // 🔢 Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "a-z") return a.name.localeCompare(b.name);
    if (sortOrder === "z-a") return b.name.localeCompare(a.name);
    return 0;
  });

  // 📄 Pagination Logic
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };


  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  

  return (
    <div className="product-list-container">
      <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
        <SlidersHorizontal className="filter-icon" /> Filters
      </button>

      {/* Filter Panel */}
      <aside className={`filter-panel ${isFilterOpen ? "open" : ""}`}>
        <button className="close-filter" onClick={() => setIsFilterOpen(false)}>✖</button>

        <h3>Filter by Price</h3>
        <input type="range" min="0" max="150" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="price-slider" />
        <p>Max Price: ${priceRange}</p>

        <h3>Filter by Brand</h3>
        {uniqueBrands.map((brand) => (
          <label key={brand} className="filter-checkbox">
            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
            {brand}
          </label>
        ))}

        <h3>Availability</h3>
        <label className="filter-radio"><input type="radio" name="availability" value="all" checked={availabilityFilter === "all"} onChange={() => setAvailabilityFilter("all")} /> All</label>
        <label className="filter-radio"><input type="radio" name="availability" value="in-stock" checked={availabilityFilter === "in-stock"} onChange={() => setAvailabilityFilter("in-stock")} /> In Stock</label>
        <label className="filter-radio"><input type="radio" name="availability" value="out-of-stock" checked={availabilityFilter === "out-of-stock"} onChange={() => setAvailabilityFilter("out-of-stock")} /> Out of Stock</label>

        <h3>Special Offers</h3>
        <label className="filter-checkbox"><input type="checkbox" checked={showSpecialOffers} onChange={() => setShowSpecialOffers(!showSpecialOffers)} /> Show Only Special Offers</label>

        <h3>Sort by Name</h3>
        <label className="filter-radio"><input type="radio" name="sort" value="default" checked={sortOrder === "default"} onChange={() => setSortOrder("default")} /> Default</label>
        <label className="filter-radio"><input type="radio" name="sort" value="a-z" checked={sortOrder === "a-z"} onChange={() => setSortOrder("a-z")} /> A - Z</label>
        <label className="filter-radio"><input type="radio" name="sort" value="z-a" checked={sortOrder === "z-a"} onChange={() => setSortOrder("z-a")} /> Z - A</label>
      </aside>

      {/* Product Grid */}
      <div className="product-section">
        <section className="product-grid">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="product-card"   onClick={() => navigate(`/product/${product.id}`)}>
                <button className={`favorite-button ${favoriteProducts.includes(product.id) ? "favorited" : ""}`} onClick={() => toggleFavorite(product.id)}>
                  <Heart size={20} />
                </button>
                <img src={product.image} alt={product.name} className="product-image" />
                <h4 className="product-name">{product.name}</h4>
                <p className="product-brand"><strong>Brand:</strong> {product.brand}</p>
                <p className="product-description">{product.description}</p>
                <p className={`product-availability ${product.availability === "Out of Stock" ? "out-of-stock" : ""}`}>
                  <strong>Availability:</strong> {product.availability}
                </p>
                {product.specialOffer && <p className="product-offer">🎉 {product.specialOffer}</p>}
                <p className="product-price"><strong>Price:</strong> ${product.price}</p>
                <button
                  className="add-to-cart"
                  disabled={product.availability === "Out of Stock"}
                  onClick={() => addToCart(product.id)}
                >
                  {product.availability === "Out of Stock" ? "Out of Stock" : "🛒 Add to Cart"}
                </button>    </div>
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </section>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}><ChevronLeft /> Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next <ChevronRight /></button>
          </div>
        )}
      </div>
    </div>
  );
}
