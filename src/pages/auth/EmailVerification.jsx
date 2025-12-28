import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const EmailVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        if (otp.join('').length === 4) {
            // Mock verification
            navigate('/login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-body p-4">
            <div className="card glass max-w-md w-full p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
                        <FaEnvelope />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">Verify your Email</h2>
                <p className="text-secondary mb-8">
                    We've sent a 4-digit verification code to your email address. Please enter it below.
                </p>

                <form onSubmit={handleVerify}>
                    <div className="flex justify-center gap-3 mb-8">
                        {otp.map((data, index) => (
                            <input
                                className="w-12 h-12 text-center text-xl font-bold rounded-md bg-bg-surface-2 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                type="text"
                                name="otp"
                                maxLength="1"
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                required
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary w-full flex justify-center items-center gap-2 py-3 mb-4">
                        Verify Email <FaPaperPlane />
                    </button>
                </form>

                <p className="text-sm text-secondary">
                    Didn't receive code? <button className="text-primary font-bold hover:underline">Resend</button>
                </p>
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

export default EmailVerification;
