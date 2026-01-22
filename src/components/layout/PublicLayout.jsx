import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaExclamationCircle, FaBars, FaTimes } from 'react-icons/fa';
import LanguageSelector from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';
import ChatWidget from '../common/ChatWidget';

const PublicLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="public-layout">
      <header className="public-navbar glass">
        <div className="container h-full flex items-center justify-between">
          <Link to="/app/dashboard" className="navbar-logo">
            <img src="/logo.png" alt="DMS Logo" className="logo-img" />
          </Link>


          <nav className="hidden-sm navbar-nav">
            <LanguageSelector />
            <Link to="/role-selection" className="nav-link-public">{t('login')}</Link>
            <Link to="/register" className="btn-primary">{t('register')}</Link>
            <button onClick={toggleTheme} className="icon-btn-public">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </nav>

          <button className="show-sm mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu animate-fade-in sm:hidden">
            <nav className="flex flex-col gap-4 p-6">
              <Link to="/role-selection" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>{t('login')}</Link>
              <Link to="/register" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>{t('register')}</Link>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-sm font-medium">{t('appearance')}</span>
                <button onClick={toggleTheme} className="icon-btn-public">
                  {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>
              </div>
              <div className="mt-4">
                <LanguageSelector />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
      <ChatWidget />

      <footer className="public-footer">
        <div className="container">
          <p>© 2025 Disaster Management System | Public Portal</p>
        </div>
      </footer>

      <style>{`
        .public-navbar {
          height: var(--header-height);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--border);
        }
        .public-navbar .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        
        .navbar-logo {
          display: flex;
          align-items: center;
          height: 100%;
        }
        
        .logo-img {
          height: 40px;
          width: auto;
          object-fit: contain;
        }


        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link-public {
          font-weight: 500;
          color: var(--text-main);
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link-public:hover { color: var(--primary); }
        
        .icon-btn-public {
          font-size: 1.1rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          border: 1px solid var(--border);
          transition: all 0.2s;
          cursor: pointer;
        }
        .icon-btn-public:hover {
          background: var(--bg-surface-2);
          border-color: var(--primary);
          color: var(--primary);
        }

        .btn-primary {
          background: var(--primary);
          color: white !important;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          transition: background var(--transition-fast);
          display: inline-block;
          text-decoration: none;
        }
        .btn-primary:hover { background: var(--primary-dark); }
        
        .mobile-toggle {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu {
          position: absolute;
          top: var(--header-height);
          left: 0;
          right: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          z-index: 99;
        }
        .mobile-nav-link {
          font-size: 1.1rem;
          font-weight: 600;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--bg-surface-2);
          text-decoration: none;
          color: var(--text-main);
        }

        .public-footer {
          padding: 3rem 0;
          border-top: 1px solid var(--border);
          text-align: center;
          color: var(--text-muted);
          margin-top: 4rem;
        }
        
        @media (max-width: 640px) {
          .public-footer { margin-top: 2rem; padding: 2rem 0; }
        }
      `}</style>
    </div>
  );
};

export default PublicLayout;
