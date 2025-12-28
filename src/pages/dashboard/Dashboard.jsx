import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import StatsCard from '../../components/common/StatsCard';
import { FaExclamationTriangle, FaUsers, FaHospital, FaClock } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { t } = useLanguage();
    // Mock Data for Charts
    const incidentData = {
        labels: [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')],
        datasets: [
            {
                label: t('newIncidents'),
                data: [12, 19, 3, 5, 2, 3, 7],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4,
            },
            {
                label: t('resolved'),
                data: [10, 15, 8, 12, 5, 8, 10],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const resourceData = {
        labels: [t('available'), t('deployed'), t('maintenance')],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="dashboard animate-fade-in">
            <div className="header mb-6">
                <h2 className="text-2xl font-bold">{t('operationalOverview')}</h2>
                <p className="text-secondary">{t('realTimeAwareness')}</p>
            </div>

            <div className="stats-grid mb-8">
                <StatsCard title={t('activeIncidents')} value="24" icon={<FaExclamationTriangle />} color="danger" trend={`+12% ${t('vsLastWeek')}`} />
                <StatsCard title={t('personnelDeployed')} value="156" icon={<FaUsers />} color="info" />
                <StatsCard title={t('hospitalsActive')} value="12" icon={<FaHospital />} color="success" />
                <StatsCard title={t('avgResponseTime')} value={`14${t('mins')}`} icon={<FaClock />} color="warning" trend={`-2${t('mins')} ${t('improvement')}`} />
            </div>

            <div className="charts-grid mb-8">
                <div className="card chart-card">
                    <h3>{t('incidentTrends')}</h3>
                    <div className="chart-container">
                        <Line data={incidentData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="card chart-card">
                    <h3>{t('resourceStatus')}</h3>
                    <div className="chart-container doughnut-container">
                        <Doughnut data={resourceData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>{t('recentAlerts')}</h3>
                <div className="table-responsive">
                    <table className="w-full text-left mt-4">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="p-3">{t('severity')}</th>
                                <th className="p-3">{t('type')}</th>
                                <th className="p-3">{t('location')}</th>
                                <th className="p-3">{t('time')}</th>
                                <th className="p-3">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border">
                                <td className="p-3"><span className="badge badge-danger">{t('critical')}</span></td>
                                <td className="p-3">{t('flashFlood')}</td>
                                <td className="p-3">{t('northZone')}</td>
                                <td className="p-3">12 {t('minsAgo')}</td>
                                <td className="p-3 text-warning">{t('responding')}</td>
                            </tr>
                            <tr>
                                <td className="p-3"><span className="badge badge-warning">{t('high')}</span></td>
                                <td className="p-3">{t('powerOutage')}</td>
                                <td className="p-3">{t('hospitalLocation')}</td>
                                <td className="p-3">45 {t('minsAgo')}</td>
                                <td className="p-3 text-success">{t('resolved')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .text-2xl { font-size: 1.5rem; }
        .font-bold { font-weight: 700; }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        
        .card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .charts-grid { grid-template-columns: 1fr; }
        }
        
        .chart-container {
          position: relative;
          height: 300px;
          margin-top: 1rem;
        }
        .doughnut-container {
          height: 250px;
          display: flex;
          justify-content: center;
        }
        
        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .badge-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        
        table { border-collapse: collapse; }
        [dir="rtl"] table { text-align: right; }
        th { color: var(--text-secondary); font-weight: 600; font-size: 0.875rem; }
        [dir="rtl"] th { text-align: right; }
        td { font-size: 0.9rem; }
        .border-border { border-color: var(--border); }
      `}</style>
        </div>
    );
};

export default Dashboard;
