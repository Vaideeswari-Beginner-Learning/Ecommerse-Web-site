import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api"; // Assuming we have this, or we mock it
import "./auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.className === 'auth-input' ? 'name' : '']: e.target.value });
    // The above line was buggy in previous thought, let's just do inline
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending registration data:", formData); // Debug log
      const res = await api.post("/auth/register", formData);
      console.log("Registration success:", res.data); // Debug log
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      const msg = err.response?.data?.message || "Registration Failed. Please check console.";
      setError(msg);
      // Removed Demo Fallback to force real backend usage
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            className="auth-input"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="auth-input"
            placeholder="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button className="auth-btn">Register</button>
        </form>

        <p className="auth-link">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
