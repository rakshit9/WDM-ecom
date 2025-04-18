import { useState, useEffect } from "react";
import "../styles/productsList.css";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

export default function FavoriteProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [allFavorites, setAllFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      if (!user?.id) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/favorites/${user.id}`);
        const data = await res.json();
        const products = Array.isArray(data.favorites) ? data.favorites : [];
        setAllFavorites(products);
        setFavoriteProducts(products.map(p => p.productId));
      } catch (err) {
        console.error("❌ Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (productId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) return;

    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser.id, productId })
      });

      setFavoriteProducts((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
      setAllFavorites((prev) =>
        prev.filter((p) => p.productId !== productId)
      );
    } catch (err) {
      console.error("❌ Toggle favorite failed:", err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(allFavorites.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allFavorites.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <h2 className="favorite-title">Favorite Products</h2>
      <div className="product-list-container">
        <div className="product-section">
        {currentProducts.length < 1 ?(
              <p className="no-products">
                No favorites yet. Start adding some! ❤️
              </p>
            ):""}
          <section className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.productId} className="product-card">
                  <button
                    className={`favorite-button ${
                      favoriteProducts.includes(product.productId) ? "favorited" : ""
                    }`}
                    onClick={() => toggleFavorite(product.productId)}
                  >
                    <Heart size={20} />
                  </button>
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : "https://via.placeholder.com/150"}
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
                    <strong>Availability:</strong> {product.availableQty > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                  <p className="product-price">
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <button
                    className="add-to-cart"
                    disabled={product.availableQty === 0}
                  >
                    {product.availableQty === 0 ? "Out of Stock" : "🛒 Add to Cart"}
                  </button>
                </div>
              ))
            ) : (
              <p></p>
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
    </div>
  );
}
