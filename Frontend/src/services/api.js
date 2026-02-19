import axios from "axios";

export const api = axios.create({
  baseURL: "https://furni-backend-dtz7.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = authData.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
