import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DESIGN_MAP = {
  Sofa: ["L-Shape", "Wooden", "Premium", "Modern", "Recliner"],
  Chair: ["Office", "Gaming", "Visitor", "Executive"],
  Table: ["Dining", "Study", "Coffee", "Office"],
  Interior: ["Lamp", "Wall Shelf", "Curtains", "Carpet", "Mirror"],
};


export default function Home() {
  const navigate = useNavigate();

  // Colorful Categories
  const categories = [
    { name: "Sofa", desc: "Premium Comfort", color: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)", icon: "🛋️" },
    { name: "Chair", desc: "Ergonomic & Stylish", color: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", icon: "🪑" },
    { name: "Table", desc: "Dining & Coffee", color: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)", icon: <img src="https://img.icons8.com/color/96/coffee-table.png" alt="Table" style={{ width: '80px', height: '80px' }} /> },
    { name: "Interior", desc: "Decor & Lighting", color: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)", icon: "🖼️" }
  ];

  const handleCategoryClick = (catName) => {
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2.5rem", color: "#333" }}>
        Browse Categories
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {categories.map((c) => (
          <div
            key={c.name}
            onClick={() => handleCategoryClick(c.name)}
            style={{
              background: c.color,
              borderRadius: "20px",
              padding: "30px",
              color: "white",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 20px 30px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "15px" }}>{c.icon}</div>
            <h3 style={{ fontSize: "1.8rem", margin: "0 0 10px 0", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
              {c.name}
            </h3>
            <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>{c.desc}</p>
            <div style={{
              marginTop: "20px",
              background: "rgba(255,255,255,0.2)",
              padding: "8px 15px",
              borderRadius: "20px",
              display: "inline-block",
              fontWeight: "bold"
            }}>
              Explore ➔
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
