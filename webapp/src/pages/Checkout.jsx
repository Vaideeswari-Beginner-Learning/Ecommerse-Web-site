import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getAuth, setAuth } from "../utils/auth";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, clearCart, removeFromCart } = useContext(CartContext);
    const [user, setUser] = useState(null);

    // Determine items to checkout
    const singleItem = location.state?.singleItem;
    const checkoutItems = singleItem ? [singleItem] : cart;

    // Steps: 0=Login, 1=Address, 2=Payment, 3=Success
    const [step, setStep] = useState(0);

    // Check initial auth
    useEffect(() => {
        const authData = getAuth();
        if (authData && authData.user) {
            setUser(authData.user);
            setStep(1);
        } else {
            setStep(0);
        }
    }, []);

    const [phone, setPhone] = useState("9876543210");
    const [address, setAddress] = useState({
        street: "123 Main Street, Gandhipuram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        zip: "641012",
        phone: "9876543210"
    });

    // Service Type State
    const [serviceType, setServiceType] = useState("Material & Manpower");

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardDetails, setCardDetails] = useState({
        number: "4242424242424242",
        expiry: "12/30",
        cvv: "123",
        name: "Demo User"
    });

    // Calculate Total Price based on Cart Items
    const totalPrice = checkoutItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);

    // List of Indian States
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    ];

    const handlePincodeChange = async (e) => {
        const pincode = e.target.value;
        setAddress({ ...address, zip: pincode });

        if (pincode.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    setAddress(prev => ({
                        ...prev,
                        city: postOffice.District,
                        state: postOffice.State,
                        zip: pincode
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch address details", error);
            }
        }
    };

    const completeOrder = async (paymentId) => {
        console.log("Order Completed via", paymentId);

        try {
            // Map items to backend schema
            const orderItems = checkoutItems.map(item => ({
                product: item._id || item.id,
                title: item.name,
                price: item.price,
                qty: item.qty || 1
            }));

            // Create Order Object for Backend
            const orderData = {
                items: orderItems,
                total: totalPrice,
                shippingAddress: {
                    fullName: user?.name || "User",
                    phone: phone,
                    addressLine1: address.street,
                    city: address.city,
                    state: address.state,
                    pincode: address.zip
                },
                paymentMethod: paymentId,
                serviceType: "Product Order" // Defaulting to Product Order
            };

            // Call Backend API
            const { api } = await import("../services/api");
            await api.post("/orders", orderData);

            setStep(3);

            // Clear items
            if (singleItem) {
                removeFromCart(singleItem.id);
            } else {
                clearCart();
            }

            setTimeout(() => {
                navigate("/dashboard/user");
            }, 3000);

        } catch (error) {
            console.error("Order Creation Failed", error);
            alert("Failed to create order. Please contact support.");
        }
    };

    const handleRazorpayPayment = () => {
        const options = {
            key: "rzp_test_1234567890",
            amount: totalPrice * 100,
            currency: "INR",
            name: "Furni Shop",
            description: "Test Transaction",
            image: "https://placehold.co/100x100?text=Furni",
            handler: function (response) {
                completeOrder("Razorpay: " + response.razorpay_payment_id);
            },
            prefill: {
                name: user?.name || "User",
                email: user?.email || "user@example.com",
                contact: phone || "9000090000"
            },
            theme: {
                color: "#fb641b"
            }
        };

        if (window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } else {
            alert("Razorpay SDK not loaded. Check internet connection.");
        }
    };

    const handleStripePayment = (e) => {
        e.preventDefault();
        setTimeout(() => {
            completeOrder("Stripe (Simulated Card)");
        }, 2000);
    };

    const handleCODPayment = () => {
        setTimeout(() => {
            completeOrder("Cash on Delivery");
        }, 1000);
    };

    // --- AUTH HANDLERS ---
    const handleLoginRedirect = () => {
        navigate("/login", { state: { from: "/checkout" } });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    if (cart.length === 0 && step !== 3) {
        return <div style={{ padding: 40, textAlign: 'center' }}><h2>Your Cart is Empty</h2><button onClick={() => navigate('/products')}>Shop Now</button></div>
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>

            {/* STEP 0: LOGIN */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '15px', border: step === 0 ? '1px solid #2874f0' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, color: step === 0 ? '#2874f0' : '#878787', textTransform: 'uppercase', fontSize: '1rem' }}>
                        1. Login / Sign Up
                    </h3>
                    {step > 0 && user && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.email.split('@')[0]} ✅</span>}
                </div>
                {step === 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>Please login to complete your order safely.</p>
                        <button
                            onClick={handleLoginRedirect}
                            style={{ width: '100%', maxWidth: '300px', padding: '15px', background: '#fb641b', color: 'white', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
                        >
                            Login to Proceed
                        </button>
                        <p style={{ marginTop: '15px', color: '#878787', fontSize: '0.9rem' }}>
                            New user? <Link to="/register" style={{ color: '#2874f0', textDecoration: 'none' }}>Create an account</Link>
                        </p>
                    </div>
                )}
            </div>

            {/* STEP 1: ADDRESS */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '15px', opacity: step < 1 ? 0.5 : 1, border: step === 1 ? '1px solid #2874f0' : 'none' }}>
                <h3 style={{ margin: 0, color: step === 1 ? '#2874f0' : '#878787', textTransform: 'uppercase', fontSize: '1rem' }}>2. Delivery Address</h3>
                {step === 1 && (
                    <form onSubmit={handleAddressSubmit} style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input required placeholder="Name" style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} />
                                <input required placeholder="10-digit mobile number" style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input required placeholder="Pincode" value={address.zip} onChange={handlePincodeChange} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} maxLength={6} />
                                <input required placeholder="Locality" style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} />
                            </div>
                            <textarea required placeholder="Address (Area and Street)" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '2px', width: '100%', minHeight: '80px', resize: 'none' }} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input required placeholder="City/District/Town" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} />
                                <select
                                    required
                                    value={address.state}
                                    onChange={e => setAddress({ ...address, state: e.target.value })}
                                    style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px', background: 'white' }}
                                >
                                    <option value="">Select State</option>
                                    {indianStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button style={{ marginTop: '20px', padding: '15px 40px', background: '#fb641b', color: 'white', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>Deliver Here</button>
                    </form>
                )}
            </div>

            {/* STEP 2: PAYMENT */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '15px', opacity: step < 2 ? 0.5 : 1, border: step === 2 ? '1px solid #2874f0' : 'none' }}>
                <h3 style={{ margin: 0, color: step === 2 ? '#2874f0' : '#878787', textTransform: 'uppercase', fontSize: '1rem' }}>3. Payment</h3>
                {step === 2 && (
                    <div style={{ marginTop: '20px' }}>

                        <p style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.3rem', textAlign: 'right' }}>
                            Final Payable: ₹ {totalPrice}
                        </p>

                        {/* Payment Method Selection */}
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px', border: paymentMethod === 'card' ? '1px solid #2874f0' : '1px solid #ddd', borderRadius: '4px' }}>
                                <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                Credit/Debit Card (Stripe)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px', border: paymentMethod === 'razorpay' ? '1px solid #2874f0' : '1px solid #ddd', borderRadius: '4px' }}>
                                <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                                Razorpay / UPI
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px', border: paymentMethod === 'cod' ? '1px solid #2874f0' : '1px solid #ddd', borderRadius: '4px' }}>
                                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                Cash on Delivery
                            </label>
                        </div>

                        {/* OPTION 1: CARD (Stripe Simulation) */}
                        {paymentMethod === 'card' && (
                            <form onSubmit={handleStripePayment} style={{ maxWidth: '400px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input required placeholder="Card Number" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} maxLength={19} />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input required placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} maxLength={5} />
                                        <input required placeholder="CVV" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} maxLength={3} type="password" />
                                    </div>
                                    <input required placeholder="Card Holder Name" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '2px' }} />
                                </div>
                                <button style={{ marginTop: '20px', padding: '15px 40px', background: '#fb641b', color: 'white', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                                    PAY ₹ {totalPrice}
                                </button>
                            </form>
                        )}

                        {/* OPTION 2: RAZORPAY */}
                        {paymentMethod === 'razorpay' && (
                            <div>
                                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                                    You will be redirected to Razorpay secure payment gateway to complete your payment using UPI, Cards, or Netbanking.
                                </p>
                                <button onClick={handleRazorpayPayment} style={{ padding: '15px 40px', background: '#3395ff', color: 'white', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                                    PAY WITH RAZORPAY
                                </button>
                            </div>
                        )}

                        {/* OPTION 3: COD */}
                        {paymentMethod === 'cod' && (
                            <div>
                                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                                    Pay cash at the time of delivery. Additional charges may apply.
                                </p>
                                <button onClick={handleCODPayment} style={{ padding: '15px 40px', background: '#fb641b', color: 'white', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                                    CONFIRM ORDER
                                </button>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* STEP 3: SUCCESS POPUP */}
            {step === 3 && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.98)', color: '#333',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    zIndex: 2000,
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '8rem', marginBottom: '20px', animation: 'bounce 1s infinite alternate' }}>
                        🎉✨
                    </div>
                    <div style={{ fontSize: '4rem', marginBottom: '40px' }}>
                        ✅
                    </div>
                    <h1 style={{ marginBottom: '10px', color: '#28a745', fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.5rem', opacity: 0.8, color: '#555' }}>Your order has been placed successfully.</p>
                    <p style={{ marginTop: '20px', fontSize: '1rem', color: '#888' }}>Redirecting to My Booking...</p>
                    <style>{`
                        @keyframes bounce {
                            from { transform: translateY(0); }
                            to { transform: translateY(-20px); }
                        }
                    `}</style>
                    <button onClick={() => navigate('/dashboard/user')} style={{ marginTop: '40px', padding: '15px 40px', background: 'linear-gradient(45deg, #11998e, #38ef7d)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 5px 15px rgba(56, 239, 125, 0.4)' }}>
                        Go to My Booking
                    </button>
                </div>
            )}
        </div>
    );
}
