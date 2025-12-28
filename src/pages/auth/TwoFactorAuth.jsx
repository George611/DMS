import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const TwoFactorAuth = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleVerify = (e) => {
        e.preventDefault();
        if (code) {
            // Mock 2FA verification success
            navigate('/app/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-body p-4">
            <div className="card glass max-w-md w-full p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success text-3xl">
                        <FaShieldAlt />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication</h2>
                <p className="text-secondary mb-8">
                    To protect your account, please enter the code sent to your mobile device ending in **89.
                </p>

                <form onSubmit={handleVerify}>
                    <div className="relative mb-6">
                        <FaMobileAlt className="absolute left-3 top-3.5 text-secondary" />
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="w-full p-3 pl-10 bg-bg-surface border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-lg tracking-widest"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-3 mb-4 text-lg">
                        Verify & Sign In
                    </button>
                </form>

                <button className="text-sm text-secondary hover:text-text-main">
                    Try another way
                </button>
            </div>
            <style>{`
        .btn {
            background-color: var(--primary);
            color: white;
            border-radius: var(--radius-md);
            font-weight: 600;
            transition: all 0.2s;
        }
        .btn:hover {
            filter: brightness(1.1);
        }
      `}</style>
        </div>
    );
};

export default TwoFactorAuth;
