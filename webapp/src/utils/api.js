import { getAuth } from "./auth.js";

const BASE = "https://furni-backend-dtz7.onrender.com";

export async function api(path, options = {}) {
  const auth = getAuth();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;

  const res = await fetch(BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.message || "API Error");
  return data;
}
