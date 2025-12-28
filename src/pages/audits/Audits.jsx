import { useState } from 'react';
import { FaFilter, FaDownload, FaUser, FaBell, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaClock } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useAudit } from '../../context/AuditContext';

const Audits = () => {
    const { t } = useLanguage();
    const { auditLogs } = useAudit();
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Helper function to format relative time
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const logTime = new Date(timestamp);
        const diffMs = now - logTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    // Helper function to get icon for log type
    const getLogIcon = (type) => {
        switch (type) {
            case 'alert_created':
            case 'alert_deactivated':
                return <FaBell />;
            case 'resource_allocated':
                return <FaCheckCircle />;
            case 'user_login':
                return <FaUser />;
            case 'security_event':
                return <FaShieldAlt />;
            default:
                return <FaInfoCircle />;
        }
    };

    const filteredLogs = auditLogs.filter(log => {
        const matchesFilter = filterType === 'all' || log.severity === filterType;
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: auditLogs.length,
        critical: auditLogs.filter(l => l.severity === 'critical').length,
        warning: auditLogs.filter(l => l.severity === 'warning').length,
        info: auditLogs.filter(l => l.severity === 'info').length
    };

    return (
        <div className="audits-dashboard animate-fade-in">
            {/* Hero Header */}
            <header className="audits-hero">
                <div className="hero-content">
                    <div className="status-badge">
                        <FaClock />
                        Live Activity Monitoring
                    </div>
                    <h1 className="hero-title">System Audits</h1>
                    <p className="hero-subtitle">Complete activity log and security monitoring</p>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">
                        <FaInfoCircle />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Events</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="stat-card critical">
                    <div className="stat-icon">
                        <FaExclamationTriangle />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Critical</span>
                        <span className="stat-value">{stats.critical}</span>
                    </div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-icon">
                        <FaBell />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Warnings</span>
                        <span className="stat-value">{stats.warning}</span>
                    </div>
                </div>
                <div className="stat-card info">
                    <div className="stat-icon">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Info</span>
                        <span className="stat-value">{stats.info}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-bar">
                <div className="filter-group">
                    <button
                        className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        All Events
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'critical' ? 'active' : ''}`}
                        onClick={() => setFilterType('critical')}
                    >
                        Critical
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'warning' ? 'active' : ''}`}
                        onClick={() => setFilterType('warning')}
                    >
                        Warnings
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'info' ? 'active' : ''}`}
                        onClick={() => setFilterType('info')}
                    >
                        Info
                    </button>
                </div>
                <button className="export-btn">
                    <FaDownload />
                    Export Logs
                </button>
            </div>

            {/* Activity Timeline */}
            <div className="timeline-container">
                <div className="timeline-header">
                    <h2>Activity Timeline</h2>
                    <span className="result-count">{filteredLogs.length} events</span>
                </div>

                <div className="timeline">
                    {filteredLogs.map((log, index) => (
                        <div key={log.id} className={`timeline-item ${log.severity}`}>
                            <div className="timeline-marker">
                                <div className="marker-icon">{getLogIcon(log.type)}</div>
                                <div className="marker-line"></div>
                            </div>
                            <div className="timeline-content">
                                <div className="log-header">
                                    <div className="log-info">
                                        <h3 className="log-action">{log.action}</h3>
                                        <p className="log-details">{log.details}</p>
                                    </div>
                                    <div className="log-meta">
                                        <span className="log-user">
                                            <FaUser />
                                            {log.user}
                                        </span>
                                        <span className="log-time">
                                            <FaClock />
                                            {getRelativeTime(log.timestamp)}
                                        </span>
                                    </div>
                                </div>
                                <div className="log-footer">
                                    <span className={`severity-badge ${log.severity}`}>
                                        {log.severity.toUpperCase()}
                                    </span>
                                    <span className="log-type">{log.type.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .audits-dashboard {
                    padding: 2rem;
                    min-height: 100vh;
                }

                /* Hero Header */
                .audits-hero {
                    margin-bottom: 3rem;
                }

                .hero-content {
                    text-align: center;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    padding: 0.5rem 1.25rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.02em;
                }

                .hero-subtitle {
                    font-size: 1.125rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 500;
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .stat-card {
                    background: rgba(28, 28, 30, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 1.75rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    transition: all 0.3s;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .stat-icon {
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .stat-card.total .stat-icon {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                }

                .stat-card.critical .stat-icon {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .stat-card.warning .stat-icon {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                }

                .stat-card.info .stat-icon {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                }

                .stat-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 900;
                    color: white;
                }

                /* Controls Bar */
                .controls-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    gap: 0.75rem;
                    background: rgba(28, 28, 30, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    padding: 0.5rem;
                }

                .filter-btn {
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    border: none;
                    border-radius: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 700;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .filter-btn:hover {
                    color: rgba(255, 255, 255, 0.8);
                    background: rgba(255, 255, 255, 0.03);
                }

                .filter-btn.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
                }

                .export-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, var(--primary) 0%, rgba(var(--primary-rgb), 0.8) 100%);
                    border: none;
                    border-radius: 1rem;
                    color: white;
                    font-weight: 700;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .export-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.4);
                }

                /* Timeline */
                .timeline-container {
                    background: rgba(28, 28, 30, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 2rem;
                }

                .timeline-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .timeline-header h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                }

                .result-count {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 600;
                }

                .timeline {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .timeline-item {
                    display: flex;
                    gap: 1.5rem;
                    position: relative;
                }

                .timeline-marker {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex-shrink: 0;
                }

                .marker-icon {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.125rem;
                    z-index: 2;
                }

                .timeline-item.critical .marker-icon {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
                }

                .timeline-item.warning .marker-icon {
                    background: rgba(245, 158, 11, 0.2);
                    color: #f59e0b;
                    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
                }

                .timeline-item.info .marker-icon {
                    background: rgba(59, 130, 246, 0.2);
                    color: #3b82f6;
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }

                .marker-line {
                    width: 2px;
                    flex: 1;
                    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
                    min-height: 2rem;
                }

                .timeline-item:last-child .marker-line {
                    display: none;
                }

                .timeline-content {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    transition: all 0.3s;
                }

                .timeline-content:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: translateX(4px);
                }

                .log-header {
                    display: flex;
                    justify-content: space-between;
                    gap: 1.5rem;
                    margin-bottom: 1rem;
                }

                .log-info {
                    flex: 1;
                }

                .log-action {
                    font-size: 1.125rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .log-details {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 500;
                }

                .log-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-end;
                }

                .log-user,
                .log-time {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 600;
                }

                .log-footer {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .severity-badge {
                    padding: 0.35rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .severity-badge.critical {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .severity-badge.warning {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                }

                .severity-badge.info {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                }

                .log-type {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: capitalize;
                }

                /* RTL Support */
                [dir="rtl"] .timeline-content:hover {
                    transform: translateX(-4px);
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .audits-dashboard {
                        padding: 1rem;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .controls-bar {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .filter-group {
                        flex-wrap: wrap;
                    }

                    .log-header {
                        flex-direction: column;
                    }

                    .log-meta {
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default Audits;
