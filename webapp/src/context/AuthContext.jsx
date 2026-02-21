import { createContext, useEffect, useState } from "react";
import { getAuth } from "../utils/auth.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(getAuth());

  useEffect(() => {
    const onUpdate = () => setAuthState(getAuth());
    window.addEventListener("auth:updated", onUpdate);
    return () => window.removeEventListener("auth:updated", onUpdate);
  }, []);

  const value = {
    auth,
    user: auth?.user || null,
    token: auth?.token || null,
    isLoggedIn: !!auth?.token,
    isAdmin: auth?.user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
