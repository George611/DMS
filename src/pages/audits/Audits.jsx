import { useState, useEffect } from 'react';
import { FaFilter, FaDownload, FaUser, FaBell, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaClock } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useAudit } from '../../context/AuditContext';
import Loader from '../../components/Loader';

const Audits = () => {
    const { t } = useLanguage();
    const { auditLogs, loading, fetchAuditLogs } = useAudit();
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    // Helper function to format relative time
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const logTime = new Date(timestamp);
        const diffMs = now - logTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('justNow');
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ${t('ago')}`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ${t('ago')}`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ${t('ago')}`;
    };

    // Helper to determine severity based on action
    const getSeverity = (action) => {
        if (action.includes('DELETE') || action.includes('CRITICAL')) return 'critical';
        if (action.includes('UPDATE') || action.includes('ASSIGN')) return 'warning';
        return 'info';
    };

    // Helper function to get icon for log type
    const getLogIcon = (action) => {
        if (action.includes('INCIDENT')) return <FaExclamationTriangle />;
        if (action.includes('RESOURCE')) return <FaCheckCircle />;
        if (action.includes('LOGIN')) return <FaUser />;
        if (action.includes('STATUS')) return <FaBell />;
        return <FaInfoCircle />;
    };

    const filteredLogs = auditLogs.filter(log => {
        const severity = getSeverity(log.action);
        const matchesFilter = filterType === 'all' || severity === filterType;

        const detailsStr = typeof log.details === 'string' ? log.details : JSON.stringify(log.details);
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            detailsStr.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: auditLogs.length,
        critical: auditLogs.filter(l => getSeverity(l.action) === 'critical').length,
        warning: auditLogs.filter(l => getSeverity(l.action) === 'warning').length,
        info: auditLogs.filter(l => getSeverity(l.action) === 'info').length
    };

    if (loading && auditLogs.length === 0) return <Loader />;

    return (
        <div className="audits-dashboard animate-fade-in">
            {/* Hero Header */}
            <header className="audits-hero">
                <div className="hero-content">
                    <div className="status-badge">
                        <FaClock />
                        {t('liveActivityMonitoring')}
                    </div>
                    <h1 className="hero-title">{t('systemAudits')}</h1>
                    <p className="hero-subtitle">{t('completeActivityLog')}</p>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">
                        <FaInfoCircle />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">{t('totalEvents')}</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                </div>
                <div className="stat-card critical">
                    <div className="stat-icon">
                        <FaExclamationTriangle />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">{t('critical')}</span>
                        <span className="stat-value">{stats.critical}</span>
                    </div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-icon">
                        <FaBell />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">{t('high')}</span>
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
                    {['all', 'critical', 'warning', 'info'].map(type => (
                        <button
                            key={type}
                            className={`filter-btn ${filterType === type ? 'active' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type === 'warning' ? t('high') : (type === 'all' ? t('allEvents') : t(type))}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="glass-input px-4 py-2 rounded-lg text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="export-btn" onClick={() => window.print()}>
                        <FaDownload />
                        {t('exportLogs')}
                    </button>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="timeline-container">
                <div className="timeline-header">
                    <h2>{t('activityTimeline')}</h2>
                    <span className="result-count">{filteredLogs.length} {t('totalEvents')}</span>
                </div>

                <div className="timeline">
                    {filteredLogs.map((log) => {
                        const severity = getSeverity(log.action);
                        return (
                            <div key={log.id} className={`timeline-item ${severity}`}>
                                <div className="timeline-marker">
                                    <div className="marker-icon">{getLogIcon(log.action)}</div>
                                    <div className="marker-line"></div>
                                </div>
                                <div className="timeline-content">
                                    <div className="log-header">
                                        <div className="log-info">
                                            <h3 className="log-action">{log.action.replace(/_/g, ' ')}</h3>
                                            <div className="log-details text-xs font-mono bg-black/20 p-2 rounded mt-2">
                                                {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                                            </div>
                                        </div>
                                        <div className="log-meta">
                                            <span className="log-user">
                                                <FaUser />
                                                {log.user_name || `User ID: ${log.user_id}`}
                                            </span>
                                            <span className="log-time">
                                                <FaClock />
                                                {getRelativeTime(log.created_at)}
                                            </span>
                                            <span className="text-[10px] opacity-30 mt-1">{log.ip_address}</span>
                                        </div>
                                    </div>
                                    <div className="log-footer">
                                        <span className={`severity-badge ${severity}`}>
                                            {t(severity)}
                                        </span>
                                        <span className="log-type">{log.entity_type} #{log.entity_id}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .glass-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    outline: none;
                }
                .glass-input:focus {
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.1);
                }
                /* ... keep existing styles ... */
            `}</style>
        </div>
    );
};

export default Audits;
