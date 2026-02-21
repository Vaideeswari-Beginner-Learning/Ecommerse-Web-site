import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../utils/auth.js";
import { api } from "../services/api";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Try real API Login
      const { data } = await api.post("/auth/login", { email, password });

      if (!data) throw new Error("No response");
      setAuth(data);
      if (data.user.role === "admin") navigate("/dashboard/admin");
      else navigate("/dashboard/user");

    } catch (err) {
      console.warn("Real Auth Failed, falling back to Demo Mode", err);

      // 2. MOCK FALLBACK (for testing/demo purposes)
      let data;
      if (email === "admin@gmail.com") {
        data = { token: "mock-admin-token", user: { name: "Admin", email, role: "admin" } };
      } else if (email) {
        data = { token: "mock-user-token", user: { name: "User", email, role: "user" } };
      }

      if (data) {
        setAuth(data);
        setAuth(data);
        // alert("Running in Demo Mode (Mock Login)"); // Removed as requested
        if (data.user.role === "admin") navigate("/dashboard/admin");
        else navigate("/dashboard/user");
      } else {
        setError("Login Failed (Backend & Mock).");
      }
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            type="email"
          />
          <input
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <button className="auth-btn">Login</button>

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#007bff', fontSize: '0.9rem', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="auth-link">
          New user? <Link to="/register">Register</Link>
        </p>

        <p className="auth-link" style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          <b>Demo Credentials:</b><br />
          Admin: admin@gmail.com<br />
          User: (any other email)
        </p>
      </div>
    </div>
  );
}
