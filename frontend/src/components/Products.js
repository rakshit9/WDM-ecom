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
    title: "",
    type: "",
    price: "",
    availableQty: "",
    images: [],
    description: "",
    brand: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/my-products/${user.id}?isAdmin=${user.isAdmin}`);



      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to fetch seller products");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const generateDescription = async () => {
    if (!formData.title || !formData.type) {
      toast.error("Please enter product title and type first.");
      return;
    }

    setDescriptionLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/products/generate-description`, {
        name: formData.title,
        category: formData.type,
      });
      setFormData((prev) => ({ ...prev, description: response.data.description }));
      toast.success("Description generated successfully!");
    } catch (error) {
      toast.error("Failed to generate description");
    } finally {
      setDescriptionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("brand", formData.brand);
    fd.append("type", formData.type);
    fd.append("price", formData.price);
    fd.append("availableQty", formData.availableQty);
    fd.append("productCreatedBy", user.id);

    formData.images.forEach((imageFile) => {
      fd.append("images", imageFile);
    });

    try {
      if (editingProduct) {
        await axios.put(`${BASE_URL}/products/${editingProduct.productId}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${BASE_URL}/products/add`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Product added successfully");
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        title: "",
        type: "",
        price: "",
        availableQty: "",
        images: [],
        description: "",
        brand: ""
      });
      await fetchSellerProducts();
    } catch (error) {
      toast.error("Failed to save product");
      console.error("❌ Product save error:", error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      type: "",
      price: "",
      availableQty: "",
      images: [],
      description: "",
      brand: ""
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      type: product.type,
      price: product.price,
      availableQty: product.availableQty,
      images: [],
      description: product.description,
      brand: product.brand
    });
    setShowModal(true);
  };

  const openDescriptionModal = (product) => {
    setSelectedProduct(product);
    setDescriptionModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/products/${productId}`);
      toast.success("Product deleted successfully");
      await fetchSellerProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };


  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/150";
    return imgPath.startsWith("http")
      ? imgPath
      : `${BASE_URL}/api/uploads/${imgPath.replace(/^\/?uploads\//, "")}`;
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
            <th>Title</th>
            <th>Type</th>
            <th>Brand</th>
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
                <img
                  src={
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0].startsWith("http")
                        ? product.images[0]
                        : `${process.env.REACT_APP_BASE_URL}${product.images[0]}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={product.title}
             
                  width="50"
                      />
              </td>
              <td>{product.title}</td>
              <td>{product.type}</td>
              <td>{product.brand}</td>
              <td>${product.price}</td>
              <td>{product.availableQty}</td>
              <td>
                <button onClick={() => openEditModal(product)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(product.productId)} className="delete-btn">Delete</button>
                <button onClick={() => openDescriptionModal(product)} className="view-description-btn">View Description</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required />
              <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
              <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />

              <button type="button" onClick={generateDescription} className="generate-description-button" disabled={descriptionLoading}>
                {descriptionLoading ? "Generating..." : "Generate Description"}
              </button>

              <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required></textarea>

              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
              <input type="number" name="availableQty" placeholder="Quantity" value={formData.availableQty} onChange={handleChange} required />

              {editingProduct?.images?.length > 0 && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  {editingProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={
                        (img).startsWith("http")   ? img : `${process.env.REACT_APP_BASE_URL}${img}`
                      }
                      alt={idx}
                    
                      width="20"
                    />
                  ))}
                </div>
              )}

              <input type="file" name="images" multiple onChange={handleImageChange} />
              <button type="submit" className="add-product-button">{editingProduct ? "Update" : "Add"} Product</button>
              <button type="button" onClick={() => setShowModal(false)} className="cancel-button">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
