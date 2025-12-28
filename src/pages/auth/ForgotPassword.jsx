import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate API call
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <FaKey className="auth-icon" />
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive reset instructions</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full">Send Link</button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="success-message p-4 bg-green-100 text-green-700 rounded mb-4">
                            Check your email! We've sent password reset instructions to <strong>{email}</strong>.
                        </div>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-primary hover:underline"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="auth-footer">
                    <p>Remember your password? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
