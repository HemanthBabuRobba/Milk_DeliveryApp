import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductsManagement.css";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    unit: "L",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
      );
      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) throw new Error("Not authenticated");

      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/products`,
          formData,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          },
        );
      }

      setShowAddModal(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        stock: "",
        unit: "L",
      });
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image || "",
      stock: product.stock.toString(),
      unit: product.unit,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) throw new Error("Not authenticated");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      fetchProducts();
    } catch (error) {
      setError("Failed to delete product");
    }
  };

  if (loading && !products.length) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-management">
      <div className="section-header">
        <h2>Products</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumbnail"
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  ₹{product.price.toFixed(2)}/{product.unit}
                </td>
                <td>
                  {product.stock} {product.unit}
                </td>
                <td>
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                >
                  <option value="L">Liters (L)</option>
                  <option value="ml">Milliliters (ml)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      image: "",
                      stock: "",
                      unit: "L",
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
