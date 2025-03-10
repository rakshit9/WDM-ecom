import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/product.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Upload & Compress Before Uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      compressImage(reader.result);
    };
  };

  // ✅ Compress Image Before Sending to Backend
  const compressImage = (base64Str) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 800; // Resize to max 800px width
      const scaleSize = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
      setFormData({ ...formData, image: compressedBase64 });
    };
  };

  // ✅ Generate AI Description
  const generateDescription = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Please enter product name and category first.");
      return;
    }

    setDescriptionLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/products/generate-description`,
        {
          name: formData.name,
          category: formData.category,
        }
      );
      setFormData({ ...formData, description: response.data.description });
      toast.success("Description generated successfully!");
    } catch (error) {
      toast.error("Failed to generate description");
    } finally {
      setDescriptionLoading(false);
    }
  };

  // ✅ Submit New Product or Update Existing One
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `${BASE_URL}/products/${editingProduct.productId}`,
          formData
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${BASE_URL}/products`, formData);
        toast.success("Product added successfully");
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      image: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowModal(true);
  };

  const openDescriptionModal = (product) => {
    setSelectedProduct(product);
    setDescriptionModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      <button onClick={openAddModal} className="add-product-button">
        + Add Product
      </button>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>
                <img src={product.image} alt={product.name} width="50" />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button
                  onClick={() => openEditModal(product)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.productId)}
                  className="delete-btn"
                >
                  Delete
                </button>
                <button
                  onClick={() => openDescriptionModal(product)}
                  className="view-description-btn"
                >
                  View Description
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={generateDescription}
                className="generate-description-button"
                disabled={descriptionLoading}
              >
                {descriptionLoading ? "Generating..." : "Generate Description"}
              </button>
              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <input type="file" name="image" onChange={handleImageChange} />
              <button type="submit" className="add-product-button">
                {editingProduct ? "Update" : "Add"} Product
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
