import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, setAuth } from "../../utils/auth"; // Helper

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authData = getAuth();
    if (authData && authData.user) {
      setUser(authData.user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    setAuth(null);
    navigate("/");
  };

  // Fetch Orders from Backend
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductForFeedback, setSelectedProductForFeedback] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { api } = await import("../../services/api");
        const { data } = await api.get("/orders");

        // Transform backend data to match UI expectations if needed
        const mappedOrders = data.map(order => ({
          id: order._id,
          date: new Date(order.createdAt).toISOString().split('T')[0],
          total: order.total,
          status: order.orderStatus, // "Ordered" -> backend uses "placed", need to potentially map
          items: order.items, // Array of objects
          address: order.shippingAddress,
          serviceType: order.serviceType
        }));

        setOrders(mappedOrders);
      } catch (e) {
        console.error("Failed to load orders", e);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenFeedback = (order) => {
    setSelectedProductForFeedback(order);
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    alert(`Thank you for your feedback!\nRating: ${rating} ⭐`);
    setShowFeedbackModal(false);
  };

  // Tracking Modal Component
  const TrackingModal = ({ order, onClose }) => {
    if (!order) return null;

    const steps = ["placed", "shipped", "out_for_delivery", "delivered"]; // Backend statuses
    const currentStep = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

    // Simulate random progress for demo if status is just "Ordered" to show UI
    // In real app, this comes from backend. For now, let's just show "Ordered" as completed
    // and maybe "Shipped" if it's been more than 1 minute (simulation logic could go here)
    // For now, simple static progress based on status.

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
      }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Track Order: #{order.id}</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
            {/* Progress Line */}
            <div style={{
              position: 'absolute', top: '15px', left: '0', right: '0', height: '4px', background: '#eee', zIndex: 0
            }}>
              <div style={{
                height: '100%', background: '#28a745', width: `${(currentStep / (steps.length - 1)) * 100}%`, transition: 'width 0.5s'
              }}></div>
            </div>

            {steps.map((step, index) => (
              <div key={step} style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', background: index <= currentStep ? '#28a745' : '#eee',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 'bold'
                }}>
                  {index <= currentStep ? '✓' : index + 1}
                </div>
                <div style={{ fontSize: '0.8rem', color: index <= currentStep ? '#333' : '#999', fontWeight: index <= currentStep ? 'bold' : 'normal' }}>{step}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
            <p><strong>Items:</strong> {order.items}</p>
            <p><strong>Total:</strong> ₹ {order.total}</p>
            <p><strong>Delivery Address:</strong> {order.address?.street}, {order.address?.city}</p>
          </div>

          <button onClick={onClose} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    );
  };

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>My Booking</h2>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>
            Hello <span style={{
              background: 'linear-gradient(to right, #ff8a00, #e52e71)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              textTransform: 'capitalize'
            }}>{user.name}</span> Welcome back
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: '10px 20px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout 🏃👋
        </button>
      </div>

      {/* User Info Card */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '15px' }}>Account Details</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* Order History Section */}
      <div>
        <h3 style={{ marginBottom: '20px' }}>Recent Bookings</h3>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/10697/10697200.png"
              alt="No Orders"
              style={{ width: '200px', marginBottom: '20px' }}
            />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>You haven't placed any orders</h3>
            <p style={{ color: '#777', marginBottom: '20px' }}>All your orders will appear here</p>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '10px 25px', background: '#9c27b0', color: 'white',
                border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              View Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                background: 'white', padding: '20px', borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#555' }}>Order #{order.id}</h4>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Placed on: {order.date}</p>
                  {/* Display Service Type */}
                  <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#007bff', fontWeight: 'bold' }}>
                    Type: {order.serviceType || "Material & Manpower"}
                  </div>
                  <p style={{ fontWeight: 'bold', marginTop: '5px', color: '#333' }}>Total: ₹ {order.total}</p>
                  <div style={{ marginTop: '10px' }}>
                    {Array.isArray(order.items) ? order.items.map((item, idx) => (
                      <span key={idx} style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', marginRight: '5px', display: 'inline-block', marginBottom: '5px' }}>
                        {item.title} (x{item.qty})
                      </span>
                    )) : <span>{order.items}</span>
                    }
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{
                    padding: '6px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold',
                    background: order.status === 'Delivered' ? '#e8f5e9' : '#fff3cd',
                    color: order.status === 'Delivered' ? '#2e7d32' : '#856404'
                  }}>
                    {order.status || 'Ordered'}
                  </span>

                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* DEV ONLY: Helper to test delivery */}
                    {order.status !== 'Delivered' && (
                      <button
                        onClick={() => {
                          const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: 'Delivered' } : o);
                          setOrders(updatedOrders);
                          localStorage.setItem("orders", JSON.stringify(updatedOrders));
                        }}
                        style={{ fontSize: '0.7rem', padding: '5px', background: '#ccc', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                        title="Click to Simulate Delivery"
                      >
                        Mark Delivered (Dev)
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: '8px 15px', background: '#2196f3', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'
                      }}
                    >
                      Track Order 🚚
                    </button>

                    {/* Feedback Button - Only if Delivered */}
                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => handleOpenFeedback(order)}
                        style={{
                          padding: '8px 15px', background: '#ff9800', color: 'white',
                          border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'
                        }}
                      >
                        Rate & Review ⭐
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tracking Modal */}
        {selectedOrder && <TrackingModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedProductForFeedback && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
          }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', position: 'relative', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <button onClick={() => setShowFeedbackModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>×</button>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Rate & Review</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>Order #{selectedProductForFeedback.id}</p>

              <div style={{ marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    style={{ fontSize: '2.5rem', cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e0e0e0', transition: 'color 0.2s' }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Share your experience about the product and delivery..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{ width: '100%', height: '100px', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px', fontFamily: 'inherit', resize: 'none' }}
              />

              <button
                onClick={submitFeedback}
                style={{
                  padding: '12px 30px', background: '#673ab7', color: 'white',
                  border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1rem',
                  boxShadow: '0 4px 6px rgba(103, 58, 183, 0.3)'
                }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
