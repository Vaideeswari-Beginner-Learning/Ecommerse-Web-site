import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Temporary mock data (later connect backend)
    setItems([
      { _id: "1", title: "Wooden Sofa", category: "Sofa", design: "Wooden", price: 25000, images: ["/Product/sofa/wooden/1.jpg"] },
      { _id: "2", title: "Office Chair", category: "Chair", design: "Office", price: 9000, images: ["/Product/chair/office/1.jpg"] },
    ]);
  }, []);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Products</h2>

        <Link to="/dashboard/admin/products/new">
          <button className="order-btn">+ Add Product</button>
        </Link>
      </div>

      <div className="product-grid" style={{ marginTop: 12 }}>
        {items.map((p) => (
          <div key={p._id} className="product-card">
            <img src={p.images?.[0]} alt={p.title} />

            <div className="product-card-body">
              <p className="product-title">{p.title}</p>
              <p className="product-meta">{p.category} • {p.design}</p>
              <p className="product-price">₹{p.price}</p>

              <div className="card-actions">
                <Link to={`/dashboard/admin/products/${p._id}`} style={{ flex: 1 }}>
                  <button className="btn-small btn-view" style={{ width: "100%" }}>
                    Edit
                  </button>
                </Link>

                <button className="btn-small" style={{ background: "#ff4d4d", color: "#fff" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
