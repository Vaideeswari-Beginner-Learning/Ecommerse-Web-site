import { useState } from "react";

const MENU = {
  Sofa: ["All", "L-Shape", "Wooden", "Premium", "Modern", "Recliner"],
  Chair: ["All", "Office", "Gaming", "Visitor", "Executive"],
  Table: ["All", "Dining", "Study", "Coffee", "Office"],
  Interior: ["All", "Lamp", "Wall Shelf", "Curtains", "Carpet", "Mirror"],
};

export default function VerticalCategorySidebar({ value, onChange }) {
  // value = { category: "All", design: "All" }
  const [open, setOpen] = useState("Sofa"); // default open

  const pick = (category, design) => {
    onChange({ category, design });
  };

  return (
    <div className="vside">
      <h3 className="vside-title">Filters</h3>

      {/* Show All */}
      <button
        className={`vside-all ${value.category === "All" ? "active" : ""}`}
        onClick={() => pick("All", "All")}
        type="button"
      >
        Show All Products
      </button>

      {Object.keys(MENU).map((cat) => (
        <div key={cat} className="vside-section">
          <button
            type="button"
            className="vside-cat"
            onClick={() => setOpen(open === cat ? null : cat)}
          >
            <span>{cat}</span>
            <span className="arrow">{open === cat ? "▲" : "▼"}</span>
          </button>

          {open === cat && (
            <div className="vside-list">
              {MENU[cat].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`vside-item ${
                    value.category === cat && value.design === d ? "active" : ""
                  }`}
                  onClick={() => pick(cat, d)}
                >
                  {d === "All" ? `Show All ${cat}` : d}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
