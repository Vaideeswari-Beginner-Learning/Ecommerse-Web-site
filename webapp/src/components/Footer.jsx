import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#1a1a1a',
            color: '#fff',
            padding: '60px 40px 20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            marginTop: 'auto' // Pushes footer to bottom if flex container
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                marginBottom: '40px'
            }}>
                {/* Column 1: About */}
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#ff4d4d' }}>FurnitureSHop</h3>
                    <p style={{ color: '#aaa', lineHeight: '1.6' }}>
                        Transform your living space with our premium collection of modern furniture.
                        Quality, comfort, and style tailored for your home.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px', display: 'inline-block' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Home</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/products" style={{ color: '#ccc', textDecoration: 'none' }}>Shop</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/cart" style={{ color: '#ccc', textDecoration: 'none' }}>Cart</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Login</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px', display: 'inline-block' }}>Contact Us</h4>
                    <p style={{ color: '#aaa', marginBottom: '10px' }}>📍 123 Furniture St, Design City, India</p>
                    <p style={{ color: '#aaa', marginBottom: '10px' }}>📞 +91 12345 67890</p>
                    <p style={{ color: '#aaa', marginBottom: '10px' }}>✉️ support@furnitureshop.com</p>
                </div>

                {/* Column 4: Newsletter/Social */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px', display: 'inline-block' }}>Stay Connected</h4>
                    <p style={{ color: '#aaa', marginBottom: '15px' }}>Subscribe for latest updates and offers.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="email" placeholder="Your Email" style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '100%' }} />
                        <button style={{ padding: '8px 15px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Go</button>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
                        <span style={{ cursor: 'pointer' }}>🔵</span>
                        <span style={{ cursor: 'pointer' }}>📸</span>
                        <span style={{ cursor: 'pointer' }}>🐦</span>
                        <span style={{ cursor: 'pointer' }}>▶️</span>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                borderTop: '1px solid #333',
                paddingTop: '20px',
                textAlign: 'center',
                color: '#666',
                fontSize: '0.9rem'
            }}>
                &copy; {new Date().getFullYear()} FurnitureSHop. All rights reserved. | Handcrafted with ❤️
            </div>
        </footer>
    );
};

export default Footer;
