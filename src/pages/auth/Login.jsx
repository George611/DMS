import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaShieldAlt, FaHandsHelping, FaUserShield, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Role state, initialized from location state or default
  const [role, setRole] = useState(location.state?.role || 'citizen');

  const roleConfig = {
    authority: { label: t('authority'), color: '#3b82f6', icon: <FaUserShield /> },
    volunteer: { label: t('volunteer'), color: '#10b981', icon: <FaHandsHelping /> },
    citizen: { label: t('citizen'), color: '#64748b', icon: <FaUser /> }
  };
  const currentConfig = roleConfig[role] || roleConfig.citizen;

  // Randomize stats and update periodically
  const [stats, setStats] = useState({
    units: Math.floor(Math.random() * 50) + 20, // 20-70 active units
    alerts: Math.floor(Math.random() * 10) + 1  // 1-11 live alerts
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        units: Math.floor(Math.random() * 50) + 20,
        alerts: Math.floor(Math.random() * 10) + 1
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Login context already handles user state, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSocialLogin = (provider) => {
    // Redirect to mock provider
    navigate(`/auth/mock/${provider}?returnTo=/2fa&mode=login`);
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">

        {/* Left Side - Visual */}
        <div key={role} className="login-visual animate-fade-in" style={{ backgroundColor: currentConfig.color }}>
          <div className="visual-content">
            <Link to="/app/dashboard" className="visual-logo-link animate-slide-up-fade">
              <img src="/logo.png" alt="DMS Logo" className="visual-logo" />
            </Link>
            <h1 className="animate-slide-up-fade">{currentConfig.label} {t('access')}</h1>

            <p className="subtitle animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
              <FaCheck className="inline mr-2 text-white/80" /> {t('signIn')} as {currentConfig.label}.
            </p>
          </div>

          <div className="system-status-card">
            <div className="status-header">
              <div className="status-dot"></div>
              <p>{t('systemOperational')}</p>
            </div>
            <p className="stat-text">{t('activeUnits')}: <strong key={`units-${stats.units}`} className="animate-pulse-slow">{stats.units}</strong></p>
            <p className="stat-text">{t('liveAlerts')}: <strong key={`alerts-${stats.alerts}`} className="animate-pulse-slow">{stats.alerts}</strong></p>
          </div>

          {/* Decorative Circles */}
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-container">
          <div className="form-wrapper">

            {/* Role Switcher */}
            <div className="role-switcher-inline">
              {Object.entries(roleConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`role-tab ${role === key ? 'active' : ''}`}
                  style={{ '--active-color': config.color }}
                >
                  <span className="tab-icon">{config.icon}</span>
                  <span className="tab-label">{config.label}</span>
                </button>
              ))}
            </div>

            <div className="form-header">
              <h2>{t('signIn')}</h2>
              <p>{t('enterDetails')}</p>
              {error && <div className="error-message animate-fade-in">{error}</div>}
            </div>


            <form onSubmit={handleSubmit} className="login-form">

              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder={t('emailAddress')}
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('password')}
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">{t('rememberMe')}</label>
                </div>
                <Link to="/forgot-password" className="forgot-link">{t('forgotPassword')}</Link>
              </div>

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : t('signIn')}
              </button>

            </form>

            <div className="divider">
              <span className="line"></span>
              <span className="text">{t('orContinueWith')}</span>
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

            <p className="register-link">
              {t('newToDms')} <Link to="/register" className="link-bold">{t('createAccount')}</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-body);
          padding: 1rem;
          font-family: 'Inter', sans-serif;
        }
        
        .login-card {
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
          .login-card {
            flex-direction: row;
          }
        }

        /* Left Visual Side */
        .login-visual {
          width: 100%;
          background-color: var(--info); /* Different color from Register */
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
          .login-visual {
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

        .visual-logo-link {
          display: inline-block;
          margin-bottom: 2rem;
        }
        .visual-logo {
          height: 60px;
          width: auto;
          filter: brightness(0) invert(1); /* Make logo white for colored background if needed, or keep original */
          object-fit: contain;
        }


        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.4;
        }

        .system-status-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-top: 2rem;
        }

        .status-header {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           margin-bottom: 0.5rem;
           font-weight: bold;
           font-size: 0.875rem;
           text-transform: uppercase;
           letter-spacing: 0.05em;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background-color: #4ade80;
            border-radius: 50%;
            box-shadow: 0 0 10px #4ade80;
        }

        .stat-text {
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
            opacity: 0.9;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          filter: blur(40px);
        }
        .circle-1 { width: 300px; height: 300px; top: -100px; right: -100px; }
        .circle-2 { width: 300px; height: 300px; bottom: -100px; left: -100px; background: rgba(0, 0, 0, 0.1); }

        /* Right Form Side */
        .login-form-container {
          width: 100%;
          padding: 2rem;
          background-color: var(--bg-surface);
        }

        @media (min-width: 768px) {
          .login-form-container {
            width: 55%;
            padding: 3rem;
          }
        }

        .form-wrapper {
          max-width: 400px;
          margin: 0 auto;
        }

        .role-switcher-inline {
          display: flex;
          background: var(--bg-surface-2);
          padding: 4px;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          border: 1px solid var(--border);
          gap: 4px;
        }

        .role-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          gap: 4px;
          min-width: 0;
        }

        .role-tab.active {
          background: var(--bg-surface);
          color: var(--active-color);
          box-shadow: var(--shadow-sm);
        }

        .tab-icon {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .tab-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-align: center;
        }

        .role-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-header h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .form-header p { color: var(--text-secondary); }
        
        .error-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--danger);
          color: var(--danger);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-form {

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
        
        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.875rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }
        .remember-me input { margin-top: 1px; accent-color: var(--primary); }

        .forgot-link { color: var(--primary); text-decoration: none; font-weight: 500; }
        .forgot-link:hover { text-decoration: underline; }

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

        .register-link {
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

export default Login;
