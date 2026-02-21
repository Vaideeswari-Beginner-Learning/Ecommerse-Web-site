import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import products from "../data/products"; // Import for suggestions

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Suggestion & Voice State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const searchRef = useRef(null);

  const words = ["Sofas...", "Tables...", "Chairs...", "Interior..."];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setPlaceholder(
        isDeleting
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 150);

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      // Smart Search Logic
      const lowerTerm = searchTerm.toLowerCase();
      const underMatch = lowerTerm.match(/(.+) under (\d+)/);
      if (underMatch) {
        navigate(`/products?search=${underMatch[1].trim()}&maxPrice=${underMatch[2]}`);
      } else {
        navigate(`/products?search=${searchTerm}`);
      }
      setShowSuggestions(false);
    }
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
      };
    } else {
      alert("Voice search not supported in this browser.");
    }
  };

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "15px 30px",
      background: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", // Colorful Gradient
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      position: 'sticky', top: 0, zIndex: 1000
    }}>
      {/* Logo Section */}
      <div className="nav-left" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "1.8rem", fontFamily: "'Poppins', sans-serif" }}>
          <span style={{ color: "#333" }}>Furniture</span>
          <span style={{ color: "#ff4d4d" }}>SHop</span>
        </Link>
      </div>

      {/* Central Search Bar */}
      <div className="nav-center" style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }} ref={searchRef}>
        <form onSubmit={handleSearch} style={{
          position: 'relative', width: '100%', maxWidth: '500px',
          display: 'flex', alignItems: 'center', background: 'white',
          borderRadius: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '5px'
        }}>
          <input
            type="text"
            placeholder={`Search ${placeholder}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1, padding: '10px 15px', border: 'none', background: 'transparent',
              outline: 'none', fontSize: '1rem', marginLeft: '10px'
            }}
          />

          <button type="button" onClick={handleVoiceSearch} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '5px' }}>
            🎤
          </button>

          <button type="submit" style={{
            background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', margin: '2px'
          }}>
            🔍
          </button>
        </form>

        {/* Auto Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: '500px', background: 'white', borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', marginTop: '5px', overflow: 'hidden', zIndex: 1001
          }}>
            {suggestions.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSearchTerm(item.name);
                  navigate(`/products?search=${item.name}`);
                  setShowSuggestions(false);
                }}
                style={{
                  padding: '10px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <img src={item.image} alt={item.name} style={{ width: '30px', height: '30px', borderRadius: '5px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Icons Section */}
      <div className="nav-right" style={{ display: "flex", gap: "25px", alignItems: "center" }}>

        {/* Our Services Dropdown */}
        <div
          style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}
          onMouseEnter={() => setShowServices(true)}
          onMouseLeave={() => setShowServices(false)}
        >
          <span style={{ color: "#333", fontWeight: "600", padding: '10px 0' }}>Our Services ▾</span>
          {showServices && (
            <div style={{
              position: 'absolute', top: '100%', left: '-20px',
              background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              borderRadius: '10px', overflow: 'hidden', minWidth: '220px', zIndex: 1000,
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              <Link
                to="/services/general"
                style={{ display: 'block', padding: '15px 20px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                onClick={() => setShowServices(false)}
                onMouseEnter={(e) => e.target.style.background = '#f9f9f9'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                ℹ️ General Information
              </Link>
              <Link
                to="/services/appointment"
                style={{ display: 'block', padding: '15px 20px', textDecoration: 'none', color: '#333', transition: 'background 0.2s' }}
                onClick={() => setShowServices(false)}
                onMouseEnter={(e) => e.target.style.background = '#f9f9f9'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                📅 Book My Appointment
              </Link>
            </div>
          )}
        </div>

        <Link to="/products" style={{ color: "#333", textDecoration: "none", fontWeight: "600" }}>Products</Link>

        <Link to="/cart" style={{ color: "#333", textDecoration: "none", fontSize: '1.4rem', position: 'relative' }} title="Cart">
          🛒
        </Link>
        <Link to="/login" style={{ color: "#333", textDecoration: "none", fontSize: '1.4rem' }} title="Login">
          👤
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
