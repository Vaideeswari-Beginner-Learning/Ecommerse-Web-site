import axios from "axios";

export const api = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://furni-backend-dtz7.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const authValue = localStorage.getItem("auth");
  const authData = authValue ? JSON.parse(authValue) : null;

  if (authData && authData.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});
