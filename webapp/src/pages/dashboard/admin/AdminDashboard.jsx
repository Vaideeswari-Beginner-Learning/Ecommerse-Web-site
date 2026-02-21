import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Define Design Options per Category
  const categoryDesigns = {
    "Sofa": ["L-Shape", "Modern", "Wooden", "Leather", "Fabric"],
    "Chair": ["Wooden", "Office", "Plastic", "Ergonomic", "Dining"],
    "Table": ["Dining", "Office", "Coffee", "Glass", "Study"],
    "Interior": ["Lamp", "Vase", "Wall Art", "Decor", "Lighting"]
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "Sofa",
    design: "",
    material: [],
    size: [],
    price: "",
    images: "",
    stock: 10,
    description: ""
  });
  const [message, setMessage] = useState("");

  // Force refresh products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Try fetching real data
      // const res = await api.get("/products");
      // if (Array.isArray(res.data)) setProducts(res.data);

      // FOR DEMO: Allow LocalStorage to be the source of truth if API fails or for "Sync" feature
      const saved = localStorage.getItem("products");
      if (saved) {
        setProducts(JSON.parse(saved));
      } else {
        // Initialize empty if needed
        setProducts([]);
      }

    } catch (err) {
      console.error("Failed to fetch products", err);
      // Fallback
      const saved = localStorage.getItem("products");
      if (saved) setProducts(JSON.parse(saved));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "images") setImageError(false);

    // Reset Design when Category changes
    if (e.target.name === "category") {
      setFormData(prev => ({ ...prev, category: e.target.value, design: "" }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const currentValues = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, images: reader.result });
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: formData.images.split(",").map(url => url.trim())
    };

    // Calculate New State first for Local Storage Sync
    let newProducts = [...products];

    // Optimistic Update
    if (isEditing) {
      newProducts = newProducts.map(p => p._id === editId ? { ...p, ...payload } : p);
    } else {
      newProducts.push({ _id: Date.now().toString(), ...payload });
    }

    // SYNC: Save to LocalStorage immediately (Main source for Demo)
    localStorage.setItem("products", JSON.stringify(newProducts));
    setProducts(newProducts); // Update UI
    setMessage(isEditing ? "Product Updated (Demo/Local)!" : "Product Added (Demo/Local)!");

    // Try Real Backend (Optional / Fire & Forget)
    try {
      if (isEditing) await api.put(`/products/${editId}`, payload);
      else await api.post("/products", payload);
    } catch (err) {
      console.warn("Backend sync failed, but saved locally.", err);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "", category: "Sofa", design: "", price: "", images: "", stock: 10, description: ""
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Handle Edit: Populate form with existing data
  const handleEdit = (product) => {
    // Resolve Image field (Handle both legacy 'image' and new 'images' array)
    let existingImages = "";
    if (product.images && Array.isArray(product.images)) {
      existingImages = product.images.join(",");
    } else if (typeof product.images === "string") {
      existingImages = product.images;
    } else if (product.image) {
      existingImages = product.image; // Fallback for legacy data
    }

    setFormData({
      title: product.title || product.name || "", // Handle legacy 'name'
      category: product.category,
      design: product.design || "",
      price: product.price,
      images: existingImages,
      stock: product.stock || 10,
      description: product.description || ""
    });
    setEditId(product._id || product.id);
    setIsEditing(true);
    setMessage("Editing Mode Enabled");

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    // Calculate new state
    const newProducts = products.filter(p => p._id !== id);

    // Update UI & LocalStorage
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
    setMessage("Product Deleted (Local).");

    // Try Backend
    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      console.warn("Backend delete failed, but removed locally.", err);
    }
  };

  const handleClearAll = () => {
    if (!window.confirm("WARNING: This will delete ALL products! Are you sure?")) return;

    setProducts([]);
    localStorage.removeItem("products");
    setMessage("All products cleared!");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="admin-container">

        {/* TOP: FORM SECTION */}
        <div className="form-section">
          <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
          {message && <p className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Sofa">Sofa</option>
                  <option value="Chair">Chair</option>
                  <option value="Table">Table</option>
                  <option value="Interior">Interior</option>
                </select>
              </div>
              <div className="form-group">
                <label>Design / Style</label>
                <select name="design" value={formData.design} onChange={handleChange} required>
                  <option value="">Select Design</option>
                  {categoryDesigns[formData.category]?.map(design => (
                    <option key={design} value={design}>{design}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Material</label>
                <div className="checkbox-group">
                  {["Fabric", "Leather", "Wood", "Plastic", "Glass", "Metal"].map(m => (
                    <label key={m} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="material"
                        value={m}
                        checked={formData.material?.includes(m)}
                        onChange={handleCheckboxChange}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Size</label>
                <div className="checkbox-group">
                  {["Small", "Medium", "Large", "Standard"].map(s => (
                    <label key={s} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="size"
                        value={s}
                        checked={formData.size?.includes(s)}
                        onChange={handleCheckboxChange}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <div className="image-input-wrapper">
                <input
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="Paste image URL here..."
                  className={imageError ? "input-error" : ""}
                />

                <div style={{ textAlign: 'center', margin: '5px 0', color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>OR</div>

                {/* Option 2: Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ padding: '5px' }}
                />
                {/* Live Preview & Error Handling */}
                {formData.images && (
                  <div className="image-preview-box">
                    {!imageError ? (
                      <img
                        src={formData.images.split(',')[0]}
                        alt="Preview"
                        className="preview-img"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="preview-error">
                        <span>⚠️ Unable to load image</span>
                        <small>Check if the URL is correct and accessible.</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>

            <div className="form-actions">
              <button type="submit" className="admin-btn primary">{isEditing ? "Update Product" : "Add Product"}</button>
              {isEditing && <button type="button" onClick={resetForm} className="admin-btn secondary">Cancel</button>}
            </div>
          </form>
        </div>

        {/* BOTTOM: PRODUCT LIST CART TYPE */}
        <div className="product-list-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Existing Products</h3>
            {products.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  background: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Clear All Products
              </button>
            )}
          </div>
          {products.length === 0 ? (
            <p className="no-products">No products found. Add one above!</p>
          ) : (
            <div className="admin-product-grid">
              {products.map(product => (
                <div className="admin-card" key={product._id}>
                  <div className="card-img-wrap">
                    <img src={Array.isArray(product.images) ? product.images[0] : product.images} alt={product.title} />
                  </div>
                  <div className="card-info">
                    <h4>{product.title}</h4>
                    <p className="card-price">₹ {product.price}</p>
                    <p className="card-cat">{product.category} - {product.design}</p>
                    <div className="card-actions">
                      <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div >
    </div >
  );
};

export default AdminDashboard;
