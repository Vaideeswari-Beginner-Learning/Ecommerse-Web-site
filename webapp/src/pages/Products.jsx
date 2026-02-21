import { useState, useContext, useEffect } from "react";
import productsData from "../data/products";
import { CartContext } from "../context/CartContext";
import { setAuth, getAuth } from "../utils/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Products.css";

// ... BrandSlider Component (Keep as is) ...
// Import Brand Logos (More added as requested)
import logo1 from "../assets/download.png";
import logo2 from "../assets/download (1).png";
import logo3 from "../assets/download (2).png";
import logo4 from "../assets/download (3).png";
import logo5 from "../assets/images.jpg";
import logo6 from "../assets/images (1).jpg";
import logo7 from "../assets/download.jpg";
import logo8 from "../assets/download (4).png";

const BrandSlider = () => {
  const originalBrands = [
    { name: "Brand 1", img: logo1 },
    { name: "Brand 2", img: logo2 },
    { name: "Brand 3", img: logo3 },
    { name: "Brand 4", img: logo4 },
    { name: "Brand 5", img: logo5 },
    { name: "Brand 6", img: logo6 },
    { name: "Brand 7", img: logo7 },
    { name: "Brand 8", img: logo8 },
  ];
  const brands = [...originalBrands, ...originalBrands];
  return (
    <div className="brand-slider">
      <h3>Our Trusted Brands</h3>
      <div className="slider-container">
        <div className="brand-track">
          {brands.map((brand, index) => (
            <div className="brand-item" key={index}>
              <img src={brand.img} alt={brand.name} onError={(e) => e.target.style.display = 'none'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- LOGIN MODAL COMPONENT ---
const LoginModal = ({ onClose, onLogin }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)', minWidth: '300px'
      }}>
        <h3>Please Login First</h3>
        <p style={{ marginBottom: '20px', color: '#666' }}>You need to sign in to book products.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onLogin}
            style={{ background: '#333', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Go to Login
          </button>
          <button
            onClick={onClose}
            style={{ background: '#eee', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [searchParams] = useSearchParams();
  // Safe initialization
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [designFilter, setDesignFilter] = useState("All");

  // State for Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
    else setCategory("All");
  }, [searchParams]);

  // Load products from LocalStorage
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Initial Load & Sync
    const loadProducts = () => {
      const saved = localStorage.getItem("products");
      let localProducts = [];

      if (saved) {
        localProducts = JSON.parse(saved);

        // SYNC: Update existing products from code (productsData) to User Cache (localStorage)
        // This ensures if we fix an image URL in code, the user sees it immediately
        localProducts = localProducts.map(localP => {
          const codeP = productsData.find(p => p.id === localP.id);
          if (codeP) {
            // Merge code data into local data (giving code data priority for essential fields)
            return { ...localP, ...codeP };
          }
          return localP;
        });


        // SYNC: Add entirely new products from productsData
        let hasNewData = false;
        productsData.forEach(defaultProduct => {
          if (!localProducts.find(p => p.id === defaultProduct.id)) {
            localProducts.push(defaultProduct);
            hasNewData = true;
          }
        });

        // Always save back to update the cache with fresh code data
        localStorage.setItem("products", JSON.stringify(localProducts));

      } else {
        localProducts = productsData;
        localStorage.setItem("products", JSON.stringify(productsData));
      }
      setProducts(localProducts);
    };

    loadProducts();

    const handleStorageChange = () => {
      loadProducts();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Filter Logic
  const [priceRange, setPriceRange] = useState(100000);
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL Params for Smart Search (Price)
  useEffect(() => {
    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) setPriceRange(Number(maxPrice));
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const categoryMatch = category === "All" || p.category === category;
    const designMatch = designFilter === "All" || (p.design && p.design.includes(designFilter));
    const priceMatch = p.price <= priceRange;

    // Search Filter
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = (p.name || p.title || "").toLowerCase().includes(searchLower);

    return categoryMatch && designMatch && priceMatch && nameMatch;
  });

  const handleBookNow = (product) => {
    // Check if product is valid structure
    if (!product) return;

    // Check Authentication
    const auth = getAuth();
    if (!auth) {
      navigate("/login");
      return;
    }

    addToCart(product);
    navigate("/cart");
  };

  const handleLogout = () => {
    setAuth(null);
    navigate("/");
  };

  return (
    <div className="products-layout" style={{ background: "linear-gradient(to bottom right, #e0f7fa, #fce4ec)", minHeight: '100vh', paddingBottom: '20px' }}>
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-content" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="sidebar-header">
            <h3>Filters</h3>
          </div>

          {/* Search Bar */}
          <div className="filter-group" style={{ marginBottom: '20px' }}>
            <label>Search Products</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '8px',
                borderRadius: '5px', border: '1px solid #ccc'
              }}
            />
          </div>

          <div className="filter-group">
            <label>Browse Categories</label>
            <div className="category-list">
              <button
                className={category === "All" ? "active" : ""}
                onClick={() => {
                  setCategory("All");
                  setDesignFilter("All");
                  navigate(`/products?category=All`);
                }}
              >
                All Products
              </button>

              {Object.entries({
                "Sofa": { sub: ["L-Shape", "Modern", "Wooden", "Leather"], icon: "🛋️" },
                "Chair": { sub: ["Wooden", "Office", "Plastic"], icon: "🪑" },
                "Table": { sub: ["Dining", "Office", "Coffee"], icon: <img src="https://img.icons8.com/color/48/coffee-table.png" alt="Table" style={{ width: '24px', height: '24px', verticalAlign: 'middle' }} /> },
                "Interior": { sub: ["Lamp", "Vase", "Wall Art"], icon: "🖼️" }
              }).map(([catName, data]) => (
                <div key={catName} className="category-group" style={{ marginBottom: '10px' }}>
                  <button
                    className={category === catName && designFilter === "All" ? "active" : ""}
                    style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      setCategory(catName);
                      setDesignFilter("All");
                      navigate(`/products?category=${catName}`);
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{data.icon} {catName}</span>
                    <span>{category === catName ? "🔽" : "▶️"}</span>
                  </button>

                  {/* Subcategories */}
                  {category === catName && (
                    <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                      {data.sub.map(sub => (
                        <button
                          key={sub}
                          className={designFilter === sub ? "active-sub" : ""}
                          style={{
                            padding: '5px 10px', fontSize: '0.9rem', textAlign: 'left',
                            background: designFilter === sub ? '#e0f7fa' : 'transparent',
                            color: designFilter === sub ? '#00796b' : '#666',
                            border: 'none', cursor: 'pointer', borderRadius: '4px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click
                            setDesignFilter(sub);
                          }}
                        >
                          ▫️ {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* New Filters */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#444' }}>Filter by Price</h4>
              <input
                type="range" min="0" max="100000" step="1000"
                value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
                <span>₹0</span><span>₹{priceRange}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" style={{
            fontWeight: 'bold', letterSpacing: '1px',
            background: 'linear-gradient(45deg, #ff6b6b, #f06595)',
            color: 'white', border: 'none', borderRadius: '25px',
            padding: '12px', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer', transition: 'transform 0.2s', marginTop: '20px'
          }}>
            Logout 👋✨
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="main-content">
        <h2 className="page-title">Products {category !== "All" && `- ${category}`}</h2>

        {filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((p) => {
              const displayName = p.name || p.title || "Product";
              const displayPrice = p.price;
              let displayImage = "https://placehold.co/300x200?text=No+Image";
              if (p.images && Array.isArray(p.images) && p.images.length > 0) displayImage = p.images[0];
              else if (typeof p.images === 'string' && p.images.trim() !== "") displayImage = p.images;
              else if (p.image) displayImage = p.image;

              return (
                <div className="product-card" key={p.id || p._id || Math.random()}>
                  <div className="card-image-container">
                    <img
                      src={displayImage}
                      alt={displayName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x200?text=Load+Error";
                      }}
                    />
                  </div>
                  <h3>{displayName}</h3>
                  <p className="price">₹ {displayPrice}</p>
                  <button onClick={() => handleBookNow(p)}>
                    Book Now
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <BrandSlider />
      </main>

      {/* LOGIN POPUP MODAL */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => navigate("/login")}
        />
      )}

    </div>
  );
}
