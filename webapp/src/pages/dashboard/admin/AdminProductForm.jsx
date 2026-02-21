import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/api.js";

const empty = {
  title: "",
  category: "Sofa",
  design: "",
  price: "",
  stock: 10,
  imagesText: "",
  description: "",
};

export default function AdminProductForm() {
  const nav = useNavigate();
  const { id } = useParams(); // "new" or mongoId
  const isEdit = id !== "new";

  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        setErr("");
        const p = await api(`/api/products/${id}`);

        setForm({
          title: p.title || "",
          category: p.category || "Sofa",
          design: p.design || "",
          price: p.price ?? "",
          stock: p.stock ?? 10,
          imagesText: (p.images || []).join("\n"),
          description: p.description || "",
        });
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [id, isEdit]);

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const images = form.imagesText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!form.title.trim()) return setErr("Title is required");
    if (!form.design.trim()) return setErr("Design is required");
    if (images.length === 0) return setErr("Add at least 1 image (one per line)");
    if (form.price === "" || Number(form.price) <= 0) return setErr("Enter valid price");

    const payload = {
      title: form.title.trim(),
      category: form.category,
      design: form.design.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      images,
      description: form.description || "",
    };

    try {
      if (isEdit) {
        await api(`/api/products/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api(`/api/products`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      nav("/dashboard/admin/products");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div className="container">
      <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      <form
        onSubmit={onSubmit}
        className="auth-card"
        style={{ width: "100%", maxWidth: 700, marginTop: 12 }}
      >
        <div className="auth-form">
          <input
            className="auth-input"
            value={form.title}
            onChange={onChange("title")}
            placeholder="Title"
          />

          <select
            className="auth-input"
            value={form.category}
            onChange={onChange("category")}
          >
            <option>Sofa</option>
            <option>Chair</option>
            <option>Table</option>
            <option>Interior</option>
          </select>

          <input
            className="auth-input"
            value={form.design}
            onChange={onChange("design")}
            placeholder="Design (L-Shape / Wooden / Premium...)"
          />

          <input
            className="auth-input"
            value={form.price}
            onChange={onChange("price")}
            placeholder="Price"
            type="number"
          />

          <input
            className="auth-input"
            value={form.stock}
            onChange={onChange("stock")}
            placeholder="Stock"
            type="number"
          />

          <textarea
            className="auth-input"
            rows={5}
            value={form.imagesText}
            onChange={onChange("imagesText")}
            placeholder={`Images (one per line)\nExample:\n/Product/sofa/l-shape/1.jpg\n/Product/sofa/l-shape/2.jpg`}
          />

          <textarea
            className="auth-input"
            rows={4}
            value={form.description}
            onChange={onChange("description")}
            placeholder="Description"
          />

          <button className="auth-btn">
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
