import { useState, useEffect } from 'react';
import { FaUserMd, FaHospital, FaBoxOpen, FaSearch, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import Loader from '../../components/Loader';

const Resources = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('volunteers');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [volunteers, setVolunteers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [inventory, setInventory] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [volsRes, hospRes, invRes] = await Promise.all([
                api.get('/volunteers'),
                api.get('/resources/hospitals'),
                api.get('/resources/inventory')
            ]);
            setVolunteers(volsRes.data);
            setHospitals(hospRes.data);
            setInventory(invRes.data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredVolunteers = volunteers.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.skill_sets || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInventory = inventory.filter(i =>
        t(i.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {loading && volunteers.length === 0 ? <Loader /> : (
                <div className="resource-grid">
                    {activeTab === 'volunteers' && filteredVolunteers.map(v => (
                        <div key={v.id} className="resource-card volunteer-card">
                            <div className="card-header">
                                <div className="resource-avatar">{v.name.charAt(0)}</div>
                                <div className="resource-info">
                                    <h3 className="resource-name">{v.name}</h3>
                                    <p className="resource-skill">{v.skill_sets}</p>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className={`status-pill ${v.availability_status}`}>
                                    {v.availability_status === 'available' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                    {t(v.availability_status)}
                                </span>
                                <span className="text-[10px] opacity-40">{v.phone || 'No Phone'}</span>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'hospitals' && filteredHospitals.map(h => (
                        <div key={h.id} className="resource-card hospital-card">
                            <div className="card-header">
                                <div className="resource-icon hospital-icon"><FaHospital /></div>
                                <div className="resource-info">
                                    <h3 className="resource-name">{h.name}</h3>
                                    <div className="hospital-stats">
                                        <span className="stat-item">
                                            <span className="stat-label">{t('beds')}</span>
                                            <span className="stat-value">{h.total_beds}</span>
                                        </span>
                                        <span className="stat-divider">|</span>
                                        <span className="stat-item">
                                            <span className="stat-label">Avail.</span>
                                            <span className="stat-value">{h.available_beds}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className={`status-pill ${h.available_beds > 0 ? 'active' : 'full'}`}>
                                    {h.available_beds > 0 ? <FaCheckCircle /> : <FaExclamationCircle />}
                                    {h.available_beds > 0 ? t('active') : t('full')}
                                </span>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'inventory' && filteredInventory.map(i => (
                        <div key={i.id} className="resource-card inventory-card">
                            <div className="card-header">
                                <div className="resource-icon inventory-icon"><FaBoxOpen /></div>
                                <div className="resource-info">
                                    <h3 className="resource-name">{t(i.type)}</h3>
                                    <p className="resource-location">{i.location}</p>
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
                </div>
            )}

            <style>{`
                /* ... keep existing styles ... */
            `}</style>
        </div>
    );
};

export default Resources;
