import { useState } from 'react';
import { FaUserMd, FaHospital, FaBoxOpen, FaSearch, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Resources = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('volunteers');
    const [searchTerm, setSearchTerm] = useState('');

    const volunteers = [
        { id: 1, name: 'Sarah Connor', statusKey: 'available', skillKey: 'firstAid' },
        { id: 2, name: 'John Rambo', statusKey: 'deployed', skillKey: 'searchAndRescue' },
        { id: 3, name: 'Ellen Ripley', statusKey: 'available', skillKey: 'logistics' },
    ];

    const hospitals = [
        { id: 1, name: t('cityGeneral'), beds: 45, icu: 5, statusKey: 'active' },
        { id: 2, name: t('memorialHospital'), beds: 12, icu: 0, statusKey: 'full' },
    ];

    const inventory = [
        { id: 1, itemKey: 'foodPackets', quantity: 5000, locationKey: 'warehouseA' },
        { id: 2, itemKey: 'blankets', quantity: 1200, locationKey: 'warehouseB' },
        { id: 3, itemKey: 'medKits', quantity: 450, locationKey: 'centralDepot' },
    ];

    return (
        <div className="logistics-command-center animate-fade-in">
            {/* Hero Header */}
            <header className="logistics-hero">
                <div className="hero-content">
                    <div className="status-badge">
                        <span className="pulse-dot"></span>
                        Live Resource Tracking
                    </div>
                    <h1 className="hero-title">{t('resourceManagement')}</h1>
                    <p className="hero-subtitle">{t('trackAllocateAssets')}</p>
                </div>
            </header>

            {/* Premium Tab Navigation */}
            <div className="premium-tabs">
                <button
                    className={`premium-tab ${activeTab === 'volunteers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('volunteers')}
                >
                    <FaUserMd className="tab-icon" />
                    <span>{t('volunteersTab')}</span>
                    <div className="tab-indicator"></div>
                </button>
                <button
                    className={`premium-tab ${activeTab === 'hospitals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hospitals')}
                >
                    <FaHospital className="tab-icon" />
                    <span>{t('hospitalsTab')}</span>
                    <div className="tab-indicator"></div>
                </button>
                <button
                    className={`premium-tab ${activeTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    <FaBoxOpen className="tab-icon" />
                    <span>{t('inventory')}</span>
                    <div className="tab-indicator"></div>
                </button>
            </div>

            {/* Enhanced Search */}
            <div className="search-container">
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t('searchResources')}
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Resource Content */}
            <div className="resource-grid">
                {activeTab === 'volunteers' && (
                    <>
                        {volunteers.map(v => (
                            <div key={v.id} className="resource-card volunteer-card">
                                <div className="card-header">
                                    <div className="resource-avatar">
                                        {v.name.charAt(0)}
                                    </div>
                                    <div className="resource-info">
                                        <h3 className="resource-name">{v.name}</h3>
                                        <p className="resource-skill">{t(v.skillKey)}</p>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span className={`status-pill ${v.statusKey}`}>
                                        {v.statusKey === 'available' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                        {t(v.statusKey)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'hospitals' && (
                    <>
                        {hospitals.map(h => (
                            <div key={h.id} className="resource-card hospital-card">
                                <div className="card-header">
                                    <div className="resource-icon hospital-icon">
                                        <FaHospital />
                                    </div>
                                    <div className="resource-info">
                                        <h3 className="resource-name">{h.name}</h3>
                                        <div className="hospital-stats">
                                            <span className="stat-item">
                                                <span className="stat-label">{t('beds')}</span>
                                                <span className="stat-value">{h.beds}</span>
                                            </span>
                                            <span className="stat-divider">|</span>
                                            <span className="stat-item">
                                                <span className="stat-label">{t('icu')}</span>
                                                <span className="stat-value">{h.icu}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span className={`status-pill ${h.statusKey}`}>
                                        {h.statusKey === 'active' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                        {t(h.statusKey)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'inventory' && (
                    <>
                        {inventory.map(i => (
                            <div key={i.id} className="resource-card inventory-card">
                                <div className="card-header">
                                    <div className="resource-icon inventory-icon">
                                        <FaBoxOpen />
                                    </div>
                                    <div className="resource-info">
                                        <h3 className="resource-name">{t(i.itemKey)}</h3>
                                        <p className="resource-location">{t(i.locationKey)}</p>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="quantity-display">
                                        <span className="quantity-value">{i.quantity.toLocaleString()}</span>
                                        <span className="quantity-label">{t('units')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <style>{`
                .logistics-command-center {
                    padding: 2rem;
                    min-height: 100vh;
                }

                /* Hero Header */
                .logistics-hero {
                    margin-bottom: 3rem;
                }

                .hero-content {
                    text-align: center;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    padding: 0.5rem 1.25rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
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

                /* Premium Tabs */
                .premium-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                    background: rgba(28, 28, 30, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 0.5rem;
                }

                .premium-tab {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    background: transparent;
                    border: none;
                    border-radius: 1rem;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 700;
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .premium-tab:hover {
                    color: rgba(255, 255, 255, 0.7);
                    background: rgba(255, 255, 255, 0.03);
                }

                .premium-tab.active {
                    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.05) 100%);
                    color: var(--primary);
                    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2);
                }

                .tab-icon {
                    font-size: 1.25rem;
                }

                .tab-indicator {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--primary);
                    transform: scaleX(0);
                    transition: transform 0.3s;
                }

                .premium-tab.active .tab-indicator {
                    transform: scaleX(1);
                }

                /* Search Container */
                .search-container {
                    margin-bottom: 2.5rem;
                }

                .search-wrapper {
                    position: relative;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .search-icon {
                    position: absolute;
                    left: 1.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.3);
                    font-size: 1.125rem;
                    pointer-events: none;
                }

                .search-input {
                    width: 100%;
                    padding: 1.25rem 1.5rem 1.25rem 4rem;
                    background: rgba(28, 28, 30, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1), 0 0 20px rgba(var(--primary-rgb), 0.2);
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                /* Resource Grid */
                .resource-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                /* Resource Cards */
                .resource-card {
                    background: rgba(28, 28, 30, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    padding: 1.75rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .resource-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    margin-bottom: 1.5rem;
                }

                .resource-avatar {
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary) 0%, rgba(var(--primary-rgb), 0.6) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    flex-shrink: 0;
                }

                .resource-icon {
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .hospital-icon {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .inventory-icon {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                }

                .resource-info {
                    flex: 1;
                    min-width: 0;
                }

                .resource-name {
                    font-size: 1.125rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.25rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .resource-skill,
                .resource-location {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 500;
                }

                .hospital-stats {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-top: 0.5rem;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .stat-value {
                    font-size: 1rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .stat-divider {
                    color: rgba(255, 255, 255, 0.2);
                }

                .card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-pill.available {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                }

                .status-pill.deployed {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                }

                .status-pill.active {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                }

                .status-pill.full {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .quantity-display {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .quantity-value {
                    font-size: 2rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, var(--primary) 0%, rgba(var(--primary-rgb), 0.6) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                }

                .quantity-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-top: 0.25rem;
                }

                /* RTL Support */
                [dir="rtl"] .search-icon {
                    left: auto;
                    right: 1.5rem;
                }

                [dir="rtl"] .search-input {
                    padding-left: 1.5rem;
                    padding-right: 4rem;
                }

                [dir="rtl"] .quantity-display {
                    align-items: flex-start;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .logistics-command-center {
                        padding: 1rem;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .premium-tabs {
                        flex-direction: column;
                    }

                    .resource-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Resources;
