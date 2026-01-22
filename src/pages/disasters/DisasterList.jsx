import DisasterMap from '../../components/maps/DisasterMap';
import { useAlerts } from '../../context/AlertContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaMapMarkedAlt, FaList } from 'react-icons/fa';
import { useState } from 'react';
import Loader from '../../components/Loader';

const DisasterList = () => {
    const [view, setView] = useState('map');
    const { alerts, loading } = useAlerts();
    const { t } = useLanguage();

    if (loading && alerts.length === 0) return <Loader />;

    return (
        <div className="page-container animate-fade-in p-6">
            <div className="page-header flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-black mb-2">{t('disasterManagement')}</h2>
                    <p className="text-secondary text-lg">{t('realTimeAwareness')}</p>
                </div>
                <div className="view-toggle glass-pill p-1 flex gap-1">
                    <button
                        className={`btn-toggle ${view === 'map' ? 'active' : ''}`}
                        onClick={() => setView('map')}
                    >
                        <FaMapMarkedAlt /> {t('currentView')}
                    </button>
                    <button
                        className={`btn-toggle ${view === 'list' ? 'active' : ''}`}
                        onClick={() => setView('list')}
                    >
                        <FaList /> {t('totalLogs')}
                    </button>
                </div>
            </div>

            <div className="content-area pt-4">
                {view === 'map' ? (
                    <DisasterMap />
                ) : (
                    <div className="premium-card overflow-hidden">
                        <div className="table-responsive">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>{t('alertTitle')}</th>
                                        <th>{t('location')}</th>
                                        <th>{t('status')}</th>
                                        <th>{t('time')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map(alert => (
                                        <tr key={alert.id} className={!alert.isActive ? 'row-inactive' : ''}>
                                            <td className="font-bold">
                                                <div className="flex items-center gap-3">
                                                    <span className={`type-dot ${alert.type}`}></span>
                                                    {alert.title}
                                                </div>
                                            </td>
                                            <td className="text-muted">{alert.location}</td>
                                            <td>
                                                <span className={`status-tag ${alert.isActive ? 'active' : 'inactive'}`}>
                                                    {t(alert.status)}
                                                </span>
                                            </td>
                                            <td className="text-muted">{new Date(alert.createdAt || alert.created_at).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .glass-pill {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 2rem;
            backdrop-filter: blur(10px);
        }
        .btn-toggle {
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 1.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-toggle.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 10px 20px -5px rgba(var(--primary-rgb), 0.4);
        }

        .premium-card {
            background: rgba(28, 28, 30, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 1.5rem;
        }

        .premium-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            text-align: left;
        }

        .premium-table th {
            padding: 1.25rem 2rem;
            font-size: 0.7rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: rgba(255, 255, 255, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .premium-table td {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.02);
            font-size: 0.95rem;
        }

        .row-inactive { opacity: 0.5; grayscale: 1; }

        .type-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        .type-dot.fire { background: #ef4444; box-shadow: 0 0 10px #ef4444; }
        .type-dot.flood { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        .type-dot.medical { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }
        .type-dot.earthquake { background: #10b981; box-shadow: 0 0 10px #10b981; }

        .status-tag {
            padding: 0.35rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.65rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .status-tag.active { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .status-tag.inactive { background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.3); }

        [dir="rtl"] .premium-table { text-align: right; }
      `}</style>
        </div>
    );
};

export default DisasterList;
