import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from '../common/Breadcrumbs';
import ChatWidget from '../common/ChatWidget';
import { useLanguage } from '../../context/LanguageContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const { t } = useLanguage();

  return (
    <div className="layout-root">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="page-content">
          <Breadcrumbs />
          <Outlet />
        </main>
        <ChatWidget />
        <footer className="footer flex justify-between items-center text-xs">
          <p>{t('copyright')}</p>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link">{t('privacyPolicy')}</Link>
            <Link to="/terms" className="footer-link">{t('termsOfService')}</Link>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>

      <style>{`
        .layout-root {
          display: flex;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; 
          transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (min-width: 1025px) {
          .main-content.sidebar-open {
            margin-left: var(--sidebar-width);
          }
          [dir="rtl"] .main-content.sidebar-open {
            margin-left: 0;
            margin-right: var(--sidebar-width);
          }
          .main-content.sidebar-collapsed {
            margin-left: 0;
            margin-right: 0;
          }
        }

        .page-content {
          flex: 1;
          padding: 2rem;
        }
        .footer {
          padding: 1.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-links {
          display: flex;
          gap: 1rem;
        }
        .footer-link {
          color: var(--text-muted);
          text-decoration: none;
        }
        .footer-link:hover {
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
            margin-right: 0;
          }
          .page-content {
            padding: 1.5rem 1rem;
          }
        }

        @media (max-width: 640px) {
          .footer {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
