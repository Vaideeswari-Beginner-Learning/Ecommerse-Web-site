import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Sofa", "Chair", "Table", "Interior"] },
    design: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    material: { type: [String], default: [] },
    size: { type: [String], default: [] },
    images: [{ type: String, required: true }], // store URLs or /Product/... paths
    description: { type: String, default: "" },
    stock: { type: Number, default: 10, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
