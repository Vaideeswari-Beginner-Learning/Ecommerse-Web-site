import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GeneralServices = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('material_manpower');

    const handlePlaceOrder = () => {
        // Navigate to booking appointment with the selected service type
        navigate('/services/appointment', {
            state: {
                serviceType: selectedOption === 'material_manpower'
                    ? 'Material + Manpower'
                    : 'Customer Material + Our Manpower'
            }
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fff',
            fontFamily: "'Poppins', 'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 20px'
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '50px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Service Fulfillment Option
            </h1>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '30px',
                justifyContent: 'center',
                maxWidth: '1000px',
                width: '100%',
                marginBottom: '40px'
            }}>
                {/* Option 1: Material + Manpower */}
                <div
                    onClick={() => setSelectedOption('material_manpower')}
                    style={{
                        flex: '1 1 400px',
                        padding: '40px',
                        borderRadius: '20px',
                        backgroundColor: '#fff',
                        border: selectedOption === 'material_manpower' ? '3px solid #28a745' : '1px solid #e0e0e0',
                        boxShadow: selectedOption === 'material_manpower' ? '0 10px 40px rgba(40, 167, 69, 0.15)' : '0 5px 20px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        transform: selectedOption === 'material_manpower' ? 'translateY(-5px)' : 'none'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>Material + Manpower</h2>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            border: selectedOption === 'material_manpower' ? '6px solid #28a745' : '2px solid #ccc',
                            backgroundColor: 'white'
                        }}></div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#555', fontSize: '1.1rem' }}>
                            <span style={{ color: '#28a745', marginRight: '10px', fontSize: '1.2rem' }}>✔</span>
                            We will supply all required materials
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#555', fontSize: '1.1rem' }}>
                            <span style={{ color: '#28a745', marginRight: '10px', fontSize: '1.2rem' }}>✔</span>
                            We will provide skilled manpower
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a' }}>₹25,000</div>
                        <div style={{ color: '#888', fontSize: '0.9rem', fontWeight: '500' }}>Complete end-to-end service</div>
                    </div>
                </div>

                {/* Option 2: Manpower Only */}
                <div
                    onClick={() => setSelectedOption('manpower_only')}
                    style={{
                        flex: '1 1 400px',
                        padding: '40px',
                        borderRadius: '20px',
                        backgroundColor: '#fff',
                        border: selectedOption === 'manpower_only' ? '3px solid #007bff' : '1px solid #e0e0e0',
                        boxShadow: selectedOption === 'manpower_only' ? '0 10px 40px rgba(0, 123, 255, 0.15)' : '0 5px 20px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        transform: selectedOption === 'manpower_only' ? 'translateY(-5px)' : 'none'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: 0 }}>Manpower Only</h2>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            border: selectedOption === 'manpower_only' ? '6px solid #007bff' : '2px solid #ccc',
                            backgroundColor: 'white'
                        }}></div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#555', fontSize: '1.1rem' }}>
                            <span style={{ color: '#007bff', marginRight: '10px', fontSize: '1.2rem' }}>✔</span>
                            Client will supply materials
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#555', fontSize: '1.1rem' }}>
                            <span style={{ color: '#007bff', marginRight: '10px', fontSize: '1.2rem' }}>✔</span>
                            We provide only manpower
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a' }}>₹8,000</div>
                        <div style={{ color: '#888', fontSize: '0.9rem', fontWeight: '500' }}>Service-only execution</div>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                color: '#666',
                marginBottom: '40px',
                fontSize: '0.95rem',
                backgroundColor: '#f8f9fa',
                padding: '10px 20px',
                borderRadius: '50px'
            }}>
                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>ℹ️</span>
                Final pricing depends on the selected service fulfillment option.
            </div>

            <button
                onClick={handlePlaceOrder}
                style={{
                    padding: '18px 60px',
                    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', // Gradient requested: dark blue -> green is vague, using a nice dark teal gradient which looks premium. Or I can use blue to green.
                    // "dark blue -> green"
                    backgroundImage: 'linear-gradient(to right, #004e92, #50c9c3)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    boxShadow: '0 10px 25px rgba(0, 78, 146, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 15px 35px rgba(0, 78, 146, 0.5)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0, 78, 146, 0.4)';
                }}
            >
                PLACE ORDER
            </button>
        </div>
    );
};

export default GeneralServices;
