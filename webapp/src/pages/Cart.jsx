import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329126.png"
          alt="Empty Cart"
          style={{ width: '250px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}
        />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#777', marginBottom: '30px' }}>It looks like you haven't added anything to your cart yet.</p>
        <style>{`
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
            }
        `}</style>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '12px 30px', background: '#9c27b0', color: 'white',
            border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          View Products
        </button>
      </div>
    );
  }

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-page" style={{ background: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", minHeight: '100vh', padding: '40px 20px', borderRadius: '0', marginTop: '0', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#444' }}>Your Shopping Cart</h2>

      <div className="cart-container">
        {cart.map((item) => (
          <div className="cart-card" key={item.id}>
            <div className="card-image">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="card-details">
              <h3>{item.name}</h3>
              <p className="item-price">₹ {item.price}</p>
            </div>

            <div className="card-actions">
              <div className="qty-control">
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
              <p className="subtotal">Sub: ₹ {item.price * item.qty}</p>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
              <button
                className="buy-now-btn"
                onClick={() => navigate("/checkout", { state: { singleItem: item } })}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total Cart Value: ₹ {totalPrice}</h3>
        {/* Proceed to Checkout Button Removed as requested */}
      </div>
    </div>
  );
};

export default Cart;
