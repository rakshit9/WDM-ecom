import { useState, useEffect } from "react";
import "../styles/productsList.css"; // Reuse same CSS
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import products from "../constant/constants"; // Adjust path if needed

export default function FavoriteProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // ✅ Read favorites from localStorage
  const [favoriteProducts, setFavoriteProducts] = useState(() => {
    const savedFavorites = localStorage.getItem("favoriteProducts");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // ✅ Filter products that are in favorites
  const favoriteItems = products.filter((product) =>
    favoriteProducts.includes(product.id)
  );

  // ✅ Pagination Logic
  const totalPages = Math.ceil(favoriteItems.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = favoriteItems.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // ⭐ Remove from favorites
  const toggleFavorite = (productId) => {
    const updatedFavorites = favoriteProducts.includes(productId)
      ? favoriteProducts.filter((id) => id !== productId) // Remove
      : [...favoriteProducts, productId]; // Add (Not needed here but keeps logic consistent)

    setFavoriteProducts(updatedFavorites);
    localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h2 className="favorite-title">Favorite Products</h2>
      <div className="product-list-container">
        <div className="product-section">
          <section className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <button
                    className={`favorite-button ${
                      favoriteProducts.includes(product.id) ? "favorited" : ""
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart size={20} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-brand">
                    <strong>Brand:</strong> {product.brand}
                  </p>
                  <p className="product-description">{product.description}</p>
                  <p
                    className={`product-availability ${
                      product.availability === "Out of Stock"
                        ? "out-of-stock"
                        : ""
                    }`}
                  >
                    <strong>Availability:</strong> {product.availability}
                  </p>
                  {product.specialOffer && (
                    <p className="product-offer">🎉 {product.specialOffer}</p>
                  )}
                  <p className="product-price">
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <button
                    className="add-to-cart"
                    disabled={product.availability === "Out of Stock"}
                  >
                    {product.availability === "Out of Stock"
                      ? "Out of Stock"
                      : "🛒 Add to Cart"}
                  </button>
                </div>
              ))
            ) : (
              <p className="no-products">
                No favorites yet. Start adding some! ❤️
              </p>
            )}
          </section>

          {/* Pagination */}
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
    </div>
  );
}
