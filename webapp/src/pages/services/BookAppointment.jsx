import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get pre-selected service type from navigation state if available
    const preSelectedService = location.state?.serviceType || 'Material + Manpower';

    const [formData, setFormData] = useState({
        name: '',
        serviceType: preSelectedService,
        mobile: '',
        address: '',
        details: ''
    });

    useEffect(() => {
        if (location.state?.serviceType) {
            setFormData(prev => ({ ...prev, serviceType: location.state.serviceType }));
        }
    }, [location.state]);

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log("Form Submitted", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    maxWidth: '600px',
                    width: '100%'
                }}>
                    <h2 style={{ color: '#28a745', marginBottom: '20px', fontSize: '2.5rem' }}>Thank You!</h2>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>Your appointment request has been received.</p>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>We will contact you shortly.</p>
                    <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Contact Us</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>📞 9876543210</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '30px',
                            padding: '12px 30px',
                            background: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)',
                            color: '#333',
                            border: 'none',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#333', fontSize: '2.5rem', fontWeight: 'bold' }}>Book My Appointment</h1>

                <form onSubmit={handleSubmit} style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>Service Type</label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="Material + Manpower">Option 1: Material + Manpower</option>
                            <option value="Customer Material + Our Manpower">Option 2: Customer Material + Our Manpower</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            placeholder="Enter your mobile number"
                            pattern="[0-9]{10}"
                            title="10 digit mobile number"
                            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full address"
                            rows="3"
                            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: '35px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>Additional Details (Optional)</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Any specific requirements or questions?"
                            rows="3"
                            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '18px',
                            background: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)',
                            color: '#333',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 5px 15px rgba(255, 77, 77, 0.2)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Confirm Booking
                    </button>
                </form>

                <div style={{ marginTop: '50px', textAlign: 'center', padding: '30px', background: 'white', borderRadius: '15px', border: '1px solid #eee' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#555' }}>Need immediate assistance?</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4d4d', margin: 0 }}>Contact me at 9876543210</p>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
