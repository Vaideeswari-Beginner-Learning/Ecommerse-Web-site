import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from "./pages/Checkout";
import GeneralServices from "./pages/services/GeneralServices";
import BookAppointment from "./pages/services/BookAppointment";
import { getAuth } from "./utils/auth";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  // Simple check: is there auth data?
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import Footer from "./components/Footer";

import Banner from "./components/Banner";

const App = () => {
  const location = useLocation();
  const hideBannerRoutes = ["/login", "/register", "/forgot-password"];
  const showBanner = !hideBannerRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {showBanner && <Banner />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Potected Routes: Login Required */}
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={<Checkout />} />

          {/* Service Routes */}
          <Route path="/services/general" element={<GeneralServices />} />
          <Route path="/services/appointment" element={<BookAppointment />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
