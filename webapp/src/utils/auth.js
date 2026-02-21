export const getAuth = () => {
  return JSON.parse(localStorage.getItem("auth")) || null;
};

export const setAuth = (data) => {
  // data example: { token: "xxx", user: { name, email, role } }
  localStorage.setItem("auth", JSON.stringify(data));
  window.dispatchEvent(new Event("auth:updated"));
};

export const logout = () => {
  localStorage.removeItem("auth");
  window.dispatchEvent(new Event("auth:updated"));
};
