import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard/user" replace />;

  return children;
}
