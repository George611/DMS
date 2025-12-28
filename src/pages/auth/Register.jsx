import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaUserPlus } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Register = () => {
  const { t, language } = useLanguage();
  const localizedTestimonials = t('testimonials') || [];
  const [testiIndex, setTestiIndex] = useState(0);

  useEffect(() => {
    // Reset index when language changes to ensure we don't go out of bounds if lengths differ
    setTestiIndex(0);
  }, [language]);

  useEffect(() => {
    if (localizedTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setTestiIndex((prev) => (prev + 1) % localizedTestimonials.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [localizedTestimonials]);

  const currentTestimonial = localizedTestimonials[testiIndex] || { initials: "?", name: "User", role: "Member", quote: "..." };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // In a real app, this would register the user and trigger an email.
    // For now, redirect to email verification
    register(formData);
    navigate('/verify-email');
  };

  const handleSocialLogin = (provider) => {
    // Redirect to mock provider
    navigate(`/auth/mock/${provider}?returnTo=/verify-email&mode=register`);
  };

  return (
    <div className="register-page">
      <div className="register-card animate-fade-in">

        {/* Left Side - Visual */}
        <div className="register-visual">
          <div className="visual-content">
            <h1>{t('joinDms')}</h1>
            <p className="subtitle">{t('bePartNetwork')}</p>
          </div>

          <div key={testiIndex} className="testimonial-card animate-fade-in-up">
            <div className="user-profile">
              <div className="avatar">{currentTestimonial.initials}</div>
              <div className="user-info">
                <p className="name">{currentTestimonial.name}</p>
                <p className="role">{currentTestimonial.role}</p>
              </div>
            </div>
            <p className="quote">"{currentTestimonial.quote}"</p>
          </div>

          {/* Decorative Circles */}
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>

        {/* Right Side - Form */}
        <div className="register-form-container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>{t('createAccount')}</h2>
              <p>{t('takesAMinute')}</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">

              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder={t('fullName')}
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder={t('emailAddress')}
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('password')}
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('confirmPassword')}
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                />
                <label htmlFor="terms">
                  {t('termsAgree')} <Link to="#" className="link">{t('termsOfService')}</Link> & <Link to="#" className="link">{t('privacyPolicy')}</Link>
                </label>
              </div>

              <button type="submit" className="btn-submit">
                {t('signUp')}
              </button>
            </form>

            <div className="divider">
              <span className="line"></span>
              <span className="text">{t('orJoinWith')}</span>
              <span className="line"></span>
            </div>

            <div className="social-buttons">
              <button className="social-btn" onClick={() => handleSocialLogin('google')}>
                <FaGoogle className="social-icon google" /> <span>Google</span>
              </button>
              <button className="social-btn" onClick={() => handleSocialLogin('github')}>
                <FaGithub className="social-icon github" /> <span>GitHub</span>
              </button>
            </div>

            <p className="login-link">
              {t('alreadyHaveAccount')} <Link to="/login" className="link-bold">{t('signIn')}</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-body);
          padding: 1rem;
          font-family: 'Inter', sans-serif;
        }
        
        .register-card {
          width: 100%;
          max-width: 900px;
          background-color: var(--bg-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .register-card {
            flex-direction: row;
          }
        }

        /* Left Visual Side */
        .register-visual {
          width: 100%;
          background-color: var(--primary);
          padding: 2rem;
          color: white;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 300px;
        }

        @media (min-width: 768px) {
          .register-visual {
            width: 45%;
          }
        }

        .visual-content {
          position: relative;
          z-index: 10;
        }

        .visual-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.4;
        }

        .testimonial-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-top: 2rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: #4ade80;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          border: 2px solid white;
        }

        .user-info .name { font-weight: bold; font-size: 0.875rem; }
        .user-info .role { font-size: 0.75rem; opacity: 0.8; }
        .quote { font-style: italic; font-size: 0.875rem; opacity: 0.9; }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          filter: blur(40px);
        }
        .circle-1 { width: 300px; height: 300px; top: -100px; right: -100px; }
        .circle-2 { width: 300px; height: 300px; bottom: -100px; left: -100px; background: rgba(0, 0, 0, 0.1); }

        /* Right Form Side */
        .register-form-container {
          width: 100%;
          padding: 2rem;
          background-color: var(--bg-surface);
        }

        @media (min-width: 768px) {
          .register-form-container {
            width: 55%;
            padding: 3rem;
          }
        }

        .form-wrapper {
          max-width: 400px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-header h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .form-header p { color: var(--text-secondary); }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-surface-2);
          color: var(--text-main);
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-hue), 0.2);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
        }
        .password-toggle:hover { color: var(--text-main); }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .terms-checkbox input { margin-top: 0.25rem; }

        .link { color: var(--primary); text-decoration: none; }
        .link:hover { text-decoration: underline; }

        .btn-submit {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-submit:hover {
          background-color: var(--primary-dark);
          transform: translateY(-1px);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 2rem 0;
          color: var(--text-muted);
        }
        .line { flex: 1; height: 1px; background-color: var(--border); }
        .text { padding: 0 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: transparent;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: background 0.2s;
        }
        .social-btn:hover { background-color: var(--bg-surface-2); }
        .social-icon.google { color: #db4437; }

        .login-link {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .link-bold { color: var(--primary); font-weight: 700; text-decoration: none; }
        .link-bold:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default Register;
