import { NavLink, Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaTachometerAlt, FaExclamationTriangle, FaBullhorn,
  FaSitemap, FaTruck, FaClipboardCheck, FaUserShield, FaHandsHelping, FaHospital, FaTimes, FaBoxOpen
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  // Authority Links - Updated to match user request exactly
  const authorityLinks = [
    { name: t('dashboard'), path: '/app/dashboard', icon: <MdDashboard /> },
    { name: t('disasterManagement'), path: '/app/disasters', icon: <FaExclamationTriangle /> },
    { name: t('alerts'), path: '/app/alerts', icon: <FaBullhorn /> },
    { name: t('command'), path: '/app/command', icon: <FaUserShield /> },
    { name: t('logistics'), path: '/app/logistics', icon: <FaTruck /> },
    { name: 'Inventory', path: '/app/inventory', icon: <FaBoxOpen /> },
    { name: t('audits'), path: '/app/audits', icon: <FaClipboardCheck /> },
  ];

  // Volunteer/Public Links
  const volunteerLinks = [
    { name: t('myTasks'), path: '/app/tasks', icon: <FaClipboardCheck /> },
    { name: t('resources'), path: '/app/resources', icon: <FaTruck /> },
  ];

  const links = user.role === 'authority' ? authorityLinks : volunteerLinks;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2 className="logo flex items-center justify-between gap-2">
            <Link to="/app/dashboard" className="logo-container">
              <img src="/logo.png" alt="DMS Logo" className="sidebar-logo-img" />
            </Link>
            <button className="sidebar-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>

          </h2>
        </div>

        <div className="user-role-banner">
          <span className="text-xs uppercase font-bold tracking-wider text-muted">{t('currentView')}</span>
          <div className="font-semibold capitalize text-primary">{t(user.role)}</div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end={link.path === '/'} // Only match exact for Home
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                >
                  <span className="icon">{link.icon}</span>
                  <span className="label">{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions for Authority - User Friendly Design */}
        {user.role === 'authority' && (
          <div className="quick-actions">
            <h3 className="section-title">{t('quickActions')}</h3>
            <div className="actions-grid">
              <NavLink to="/app/alerts" className="action-btn danger">
                <FaBullhorn />
                <span>{t('createAlert')}</span>
              </NavLink>

              <NavLink to="/app/report" className="action-btn primary">
                <FaExclamationTriangle />
                <span>{t('reportIssue')}</span>
              </NavLink>

              <NavLink to="/app/sos" className="action-btn warning full-width">
                <FaTachometerAlt />
                <span>{t('launchSos')}</span>
              </NavLink>

              <NavLink to="/app/alerts" className="action-btn outline full-width">
                <span>{t('viewAlerts')}</span>
              </NavLink>
            </div>
          </div>
        )}

        <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-surface);
          border-right: 1px solid var(--border);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 1001; /* Above navbar on mobile */
          box-shadow: var(--shadow-lg);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.collapsed {
          transform: translateX(-100%);
        }

        [dir="rtl"] .sidebar {
          left: auto;
          right: 0;
          border-right: none;
          border-left: 1px solid var(--border);
        }

        [dir="rtl"] .sidebar.collapsed {
          transform: translateX(100%);
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        @media (min-width: 1025px) {
          .sidebar-overlay {
            display: none;
          }
        }

        .sidebar-overlay.show {
          opacity: 1;
          pointer-events: auto;
        }

        .sidebar-close {
          color: var(--text-muted);
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }

        .sidebar-close:hover {
          background: var(--bg-surface-2);
          color: var(--danger);
        }

        /* Responsive Utilities */
        @media (max-width: 1024px) {
          .sidebar.open {
            transform: translateX(0);
          }
        }
        
        @media (min-width: 1025px) {
          .sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .logo-container {
          display: flex;
          align-items: center;
          height: 48px;
          margin-bottom: 0.5rem;
        }
        .sidebar-logo-img {
          height: 100%;
          width: auto;
          object-fit: contain;
        }

        .user-role-banner {
          padding: 0.75rem 1.5rem;
          background: var(--bg-surface-2);
          border-bottom: 1px solid var(--border);
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }
        .sidebar-nav ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          font-weight: 500;
          text-decoration: none;
        }
        .nav-link:hover {
          background-color: var(--bg-surface-2);
          color: var(--text-main);
          transform: translateX(4px);
        }
        [dir="rtl"] .nav-link:hover {
          transform: translateX(-4px);
        }
        .nav-link.active {
          background-color: var(--primary);
          color: var(--primary-content);
          box-shadow: var(--shadow-md);
        }
        .icon {
          margin-inline-end: 1rem;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }

        .quick-actions {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          background: var(--bg-surface-2);
        }
        .section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          gap: 0.5rem;
          text-align: center;
          transition: transform var(--transition-fast);
          text-decoration: none;
        }
        .action-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .action-btn.danger { background: var(--danger); color: white; }
        .action-btn.primary { background: var(--primary); color: white; }
        .action-btn.warning { background: var(--warning); color: black; }
        .action-btn.outline {
          border: 1px solid var(--border);
          color: var(--text-secondary);
          background: var(--bg-surface);
        }
        .action-btn.outline:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .full-width {
          grid-column: span 2;
          flex-direction: row;
          padding: 0.75rem;
          font-size: 0.875rem;
        }
      `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
