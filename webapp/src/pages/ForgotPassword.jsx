import { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css"; // Re-use auth styles

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <h2 className="auth-title">Reset Password</h2>

                {!submitted ? (
                    <>
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                            Enter your email to receive a password reset link.
                        </p>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <input
                                className="auth-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                type="email"
                            />
                            <button className="auth-btn">Send Reset Link</button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
                        <h3 style={{ marginBottom: '10px' }}>Check your Inbox</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            If an account exists for <b>{email}</b>, we have sent a password reset link.
                        </p>
                    </div>
                )}

                <p className="auth-link">
                    Remembered it? <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}
