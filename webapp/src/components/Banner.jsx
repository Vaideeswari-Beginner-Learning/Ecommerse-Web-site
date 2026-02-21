import React from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            position: 'relative',
            background: '#f3f0eb',
            color: '#2c3e50',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            marginBottom: '0'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '50px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '40px'
            }}>
                {/* Text Section */}
                <div style={{ flex: '1 1 300px', zIndex: 2 }}>

                    {/* Subtitle with fade in */}
                    <p style={{
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#8e8e8e',
                        marginBottom: '15px',
                        opacity: 0,
                        animation: 'fadeIn 1s ease-out 0.2s forwards'
                    }}>
                        New Collection 2026
                    </p>

                    {/* Headline with Masked Reveal */}
                    <div style={{ overflow: 'hidden', marginBottom: '5px' }}>
                        <h1 style={{
                            fontSize: '3.5rem',
                            lineHeight: '1.1',
                            fontFamily: 'serif',
                            margin: 0,
                            transform: 'translateY(100%)',
                            animation: 'slideUpReveal 1s cubic-bezier(0.2, 1, 0.3, 1) 0.4s forwards'
                        }}>
                            Modern Comfort
                        </h1>
                    </div>
                    <div style={{ overflow: 'hidden', marginBottom: '30px' }}>
                        <h1 style={{
                            fontSize: '3.5rem',
                            lineHeight: '1.1',
                            fontFamily: 'serif',
                            fontStyle: 'italic',
                            fontWeight: '400',
                            margin: 0,
                            transform: 'translateY(100%)',
                            animation: 'slideUpReveal 1s cubic-bezier(0.2, 1, 0.3, 1) 0.6s forwards'
                        }}>
                            For Authentic Living
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate('/products')}
                        style={{
                            padding: '14px 35px',
                            background: '#2c3e50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: 0,
                            animation: 'fadeIn 1s ease-out 0.8s forwards'
                        }}
                        onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 10px 20px rgba(44, 62, 80, 0.2)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Explore Now
                    </button>
                </div>

                {/* Decorative / Image Section with Float Animation */}
                <div style={{
                    flex: '1 1 300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    animation: 'float 6s ease-in-out infinite'
                }}>
                    {/* Abstract shapes */}
                    <div style={{
                        width: '280px',
                        height: '280px',
                        background: 'linear-gradient(135deg, #e0d8d0 0%, #d6cfc7 100%)',
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                        position: 'absolute',
                        right: '10px',
                        zIndex: 1,
                        animation: 'morph 8s ease-in-out infinite alternate'
                    }}></div>

                    {/* Icon/Image */}
                    <div style={{
                        zIndex: 2,
                        fontSize: '9rem',
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
                        transform: 'scale(0)',
                        animation: 'popIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards'
                    }}>
                        🛋️
                    </div>
                </div>
            </div>

            {/* Animations Styles */}
            <style>
                {`
                    @keyframes slideUpReveal {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes popIn {
                        from { transform: scale(0); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                    @keyframes morph {
                        0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                        100% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    }
                `}
            </style>
        </div>
    );
};

export default Banner;
