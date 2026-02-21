import { useParams } from "react-router-dom";
import { products } from "../data/products.js";

export default function ProductDetails() {
  const { slug } = useParams();
  const product = products.find(p => p.id === Number(slug));

  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h2>{product.title}</h2>

      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          maxWidth: 700,
          height: 380,
          objectFit: "cover",
          borderRadius: 12
        }}
      />

      <p><b>Price:</b> ₹{product.price}</p>
      <p><b>Material:</b> {product.material}</p>
      <p><b>Room:</b> {product.roomType}</p>
      <p>{product.description}</p>
    </div>
  );
}
