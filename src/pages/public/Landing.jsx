import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHandHoldingHeart, FaAmbulance, FaPhoneAlt } from 'react-icons/fa';
import { ALERTS } from '../../utils/mockData';
import { useLanguage } from '../../context/LanguageContext';

const Landing = () => {
  const { t } = useLanguage();
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  const [stats, setStats] = useState({
    incidents: 12,
    volunteers: 1240,
    shelters: 85,
    response: 24
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        incidents: Math.max(5, prev.incidents + (Math.random() > 0.5 ? 1 : -1)),
        volunteers: Math.max(1000, prev.volunteers + Math.floor(Math.random() * 10) - 5),
        shelters: Math.max(50, prev.shelters + (Math.random() > 0.7 ? 1 : -1)),
        response: Math.max(10, Math.min(60, prev.response + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
      }));
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % ALERTS.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAlert = ALERTS[currentAlertIndex];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="hero-title animate-fade-in">{t('heroTitle')}</h1>
          <p className="hero-subtitle">{t('heroSubtitle')}</p>
          <div className="flex-gap-4 flex gap-4 justify-center mt-8">
            <Link to="/login" className="btn btn-lg btn-primary">{t('reportIncident')}</Link>
            <Link to="/register" className="btn btn-lg btn-outline">{t('joinVolunteer')}</Link>
          </div>
        </div>
      </section>

      {/* Live Alerts Ticker */}
      <div className="alert-ticker">
        <div className="container flex items-center gap-4">
          <span className="ticker-label">{t('liveAlerts')} ({stats.incidents}):</span>
          <div className="ticker-content">
            {currentAlert && (
              <span key={`${currentAlert.id}-${currentAlertIndex}`} className="ticker-item animate-slide-up-fade">
                <FaExclamationTriangle className="inline mr-1 text-warning" />
                <strong>{t(currentAlert.titleKey)}</strong> in {t(currentAlert.locationKey)} ({t(currentAlert.timeKey)})
              </span>
            )}
          </div>
        </div>
      </div>


      {/* Stats Grid */}
      <section className="section bg-surface-2">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value text-danger animate-pulse-slow">{stats.incidents}</div>
              <div className="stat-label">{t('activeIncidents')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-success">{stats.volunteers.toLocaleString()}</div>
              <div className="stat-label">{t('volunteersDeployed')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-info">{stats.shelters}</div>
              <div className="stat-label">{t('sheltersOpen')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-warning">{stats.response}m</div>
              <div className="stat-label">{t('avgResponseTime')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info & CTAs */}
      <section className="section">
        <div className="container grid-cols-2 gap-8">
          <div className="info-block">
            <h2><FaPhoneAlt className="icon-inline" /> {t('emergencyContacts')}</h2>
            <ul className="contact-list">
              <li><strong>{t('nationalEmergency')}:</strong> 112</li>
              <li><strong>{t('ambulance')}:</strong> 102</li>
              <li><strong>{t('fire')}:</strong> 101</li>
              <li><strong>{t('disasterControlRoom')}:</strong> 011-2345-6789</li>
            </ul>
          </div>

          <div className="info-block">
            <h2>{t('safetyGuidelines')}</h2>
            <div className="accordion">
              <details open>
                <summary>{t('floodSafety')}</summary>
                <p>{t('floodAdvice')}</p>
              </details>
              <details>
                <summary>{t('earthquakeSafety')}</summary>
                <p>{t('earthquakeAdvice')}</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          padding: 8rem 0 6rem;
          background: linear-gradient(180deg, var(--bg-surface-2) 0%, var(--bg-body) 100%);
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, var(--primary), var(--info));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }
        .btn-outline {
          border: 2px solid var(--border);
          color: var(--text-main);
          padding: 0.9rem 2rem; 
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .btn-outline:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        
        .alert-ticker {
          background: var(--bg-surface);
          border-y: 1px solid var(--border);
          padding: 1rem 0;
          overflow: hidden;
        }
        .ticker-label {
          font-weight: 700;
          color: var(--danger);
          white-space: nowrap;
        }
        .ticker-content {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .ticker-item {
          white-space: nowrap;
          color: var(--text-main);
        }
        
        .section { padding: 5rem 0; }
        .bg-surface-2 { background-color: var(--bg-surface-2); }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }
        .stat-value {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
        }
        
        .grid-cols-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .grid-cols-2 { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.5rem; }
          .hero-subtitle { font-size: 1rem; }
          .section { padding: 3rem 0; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 2rem; }
          .flex-gap-4 { flex-direction: column; width: 100%; }
          .btn-lg { width: 100%; text-align: center; }
          .ticker-label { font-size: 0.75rem; }
          .ticker-item { font-size: 0.85rem; }
        }
        
        .info-block h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-list {
          list-style: none;
        }
        .contact-list li {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .contact-list li:last-child { border-bottom: none; }
        
        .accordion details {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
          background: var(--bg-surface);
        }
        .accordion summary {
          padding: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .accordion p {
          padding: 1rem;
          border-top: 1px solid var(--border);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default Landing;
