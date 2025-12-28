import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaSun, FaMoon, FaUserCircle, FaBell, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar glass">
      <div className="navbar-content">
        <div className="flex items-center gap-4">
          <button
            className={`hamburger-btn ${isSidebarOpen ? 'lg:hidden' : ''} transition-all duration-300 hover:text-primary`}
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <FaBars />
          </button>
          <h1 className="page-title truncate">{t('dashboard')}</h1>
        </div>

        <div className="navbar-actions">
          <LanguageSelector />

          <button className="icon-btn" aria-label="Notifications">
            <FaBell />
            <span className="badge">3</span>
          </button>

          <button onClick={toggleTheme} className="icon-btn hidden sm:flex" aria-label="Toggle Theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 cursor-pointer transition-all px-2 py-1.5 rounded-full border border-border/50 hover:bg-surface-2 hover:border-primary/30 hover:shadow-sm group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="User Menu"
            >
              <div className="flex flex-col text-end hidden md:block">
                <span className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">{user?.name || t('user')}</span>
                <span className="text-xs text-secondary">{user?.role ? t(user.role) : t('guest')}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-surface shadow-sm group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
              </div>
              <FaUserCircle className="md:hidden text-xl text-primary" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="user-dropdown-menu animate-fade-in">
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-secondary truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/app/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-bg-body hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <FaUserCircle /> {t('profile')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-danger/10 text-danger hover:text-danger-dark transition-colors flex items-center gap-2"
                  >
                    <FaSignOutAlt /> {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: var(--header-height);
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
          border-bottom: 1px solid var(--border);
        }
        .navbar-content {
          max-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }
        
        @media (max-width: 640px) {
          .navbar-content {
            padding: 0 1rem;
          }
        }

        .hamburger-btn {
          font-size: 1.25rem;
          color: var(--text-main);
          padding: 0.5rem;
          margin-left: -0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .page-title {
          font-size: 1.25rem;
          font-weight: 600;
          max-width: 120px;
        }
        @media (min-width: 768px) {
          .page-title { max-width: none; }
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .navbar-actions { gap: 1.5rem; }
        }

        .icon-btn {
          font-size: 1.2rem;
          color: var(--text-secondary);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          transition: background-color var(--transition-fast);
        }
        .icon-btn:hover {
          background-color: var(--bg-surface-2);
          color: var(--primary);
        }
        .badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--danger);
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 999px;
          min-width: 1rem;
          text-align: center;
        }

        /* Responsive Utilities */
        @media (min-width: 1025px) {
          .lg\:hidden { display: none; }
        }
        @media (max-width: 640px) {
          .sm\:flex { display: none; }
        }

        .relative { position: relative; }
        .absolute { position: absolute; }
        .right-0 { right: 0; }
        .mt-3 { margin-top: 0.75rem; }
        .w-48 { width: 12rem; }
        .bg-surface { background-color: var(--bg-surface); }
        .rounded-lg { border-radius: var(--radius-lg); }
        .shadow-xl { box-shadow: var(--shadow-xl); }
        .border { border-width: 1px; }
        .border-border { border-color: var(--border); }
        .z-50 { z-index: 50; }
        .overflow-hidden { overflow: hidden; }
        .p-4 { padding: 1rem; }
        .border-b { border-bottom-width: 1px; }
        .font-semibold { font-weight: 600; }
        .text-sm { font-size: 0.875rem; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .text-xs { font-size: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .text-left { text-align: left; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .hover\\:bg-bg-body:hover { background-color: var(--bg-body); }
        .hover\\:text-primary:hover { color: var(--primary); }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .hover\\:bg-danger\\/10:hover { background-color: rgba(239, 68, 68, 0.1); }
        .text-danger { color: var(--danger); }
        .hover\\:text-danger-dark:hover { color: #b91c1c; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:opacity-80:hover { opacity: 0.8; }
        .transition-opacity { transition: opacity 0.2s; }
        .flex-col { flex-direction: column; }
        .text-right { text-align: right; }
        .hidden { display: none; }
        .md\\:block { display: block; }
        @media (max-width: 768px) { .md\\:block { display: none; } }
        .w-10 { width: 2.5rem; }
        .h-10 { height: 2.5rem; }
        .rounded-full { border-radius: 9999px; }
        .bg-primary\\/20 { background-color: rgba(var(--primary-hue), 0.2); }
        .justify-center { justify-content: center; }
        .text-primary { color: var(--primary); }
        .font-bold { font-weight: 700; }
        .border-2 { border-width: 2px; }
        .border-surface { border-color: var(--bg-surface); }
        .shadow-sm { box-shadow: var(--shadow-sm); }
        .hover\\:scale-105:hover { transform: scale(1.05); }
        .transition-transform { transition: transform 0.2s; }

        /* New utilities */
        .text-text-main { color: var(--text-main); }
        .bg-primary\/10 { background-color: rgba(var(--primary-hue), 0.1); }
        .border-border\/50 { border-color: var(--border); opacity: 0.8; } 
        .hover\:bg-surface-2:hover { background-color: var(--bg-surface-2); }
        .hover\:border-primary\/30:hover { border-color: rgba(var(--primary-hue), 0.3); }
        .group:hover .group-hover\:text-primary { color: var(--primary); }
        .group:hover .group-hover\:text-primary { color: var(--primary); }
        .group:hover .group-hover\:scale-105 { transform: scale(1.05); }
        .w-9 { width: 2.25rem; }
        .h-9 { height: 2.25rem; }
        .md\:hidden { display: block; }

        .user-dropdown-menu {
          position: absolute;
          inset-inline-end: 0;
          top: 100%;
          margin-top: 0.75rem;
          width: 12rem;
          background-color: var(--bg-surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border);
          z-index: 50;
          overflow: hidden;
        }

        .text-end { text-align: end; }
        [dir="rtl"] .text-end { text-align: left; } /* text-end maps to right in RTL, so we want it left for names? No, names are usually end-aligned to the profile pic. So text-end is correct for both. */
        
        @media (min-width: 768px) { .md\:hidden { display: none; } }
      `}</style>
    </header>
  );
};

export default Navbar;
