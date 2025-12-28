import { useState } from 'react';
import { ALERTS as MOCK_ALERTS } from '../../utils/mockData';
import { FaBullhorn, FaPlus, FaCheck, FaTimes, FaEdit, FaPowerOff, FaBroadcastTower, FaMapMarkerAlt, FaClock, FaTrash } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useAlerts } from '../../context/AlertContext';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ setLocation, onClose }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            onClose();
        },
    });
    return null;
};

const CreateAlertModal = ({ isOpen, onClose, onSave, t }) => {
    const [newAlert, setNewAlert] = useState({
        title: '',
        type: 'critical',
        location: '',
        timeKey: 'now'
    });
    const [showMap, setShowMap] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="alert-center-overlay" onClick={onClose}>
            <div className={`alert-popup-card ${showMap ? 'alert-wide' : 'alert-compact'}`} onClick={(e) => e.stopPropagation()}>
                <div className="alert-card-inner">
                    <div className="alert-card-header">
                        <div className="alert-header-title">
                            <div className="alert-icon-badge">
                                <FaBroadcastTower />
                            </div>
                            <h2>{t('newAlert')}</h2>
                        </div>
                        <button onClick={onClose} className="alert-close-btn">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="alert-card-body">
                        {showMap ? (
                            <div className="alert-map-view transition-fade">
                                <div className="alert-map-header">
                                    <h3>Select Location on Map</h3>
                                    <button onClick={() => setShowMap(false)} className="alert-back-link">Back to Form</button>
                                </div>
                                <div className="alert-map-render-area">
                                    <MapContainer
                                        center={[51.505, -0.09]}
                                        zoom={13}
                                        style={{ height: '350px', width: '100%', filter: 'invert(90%) hue-rotate(180deg) brightness(0.9)', borderRadius: '1rem', zIndex: 1 }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker
                                            setLocation={(val) => setNewAlert({ ...newAlert, location: val })}
                                            onClose={() => setShowMap(false)}
                                        />
                                    </MapContainer>
                                </div>
                                <p className="alert-map-hint italic">Click anywhere on the map to set the alert coordinates</p>
                            </div>
                        ) : (
                            <div className="alert-form-view transition-fade">
                                <div className="alert-form-field">
                                    <label>{t('alertTitle')}</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        className="alert-premium-input"
                                        value={newAlert.title}
                                        onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                                        placeholder="e.g., Heavy Cyclone Alert"
                                    />
                                </div>

                                <div className="alert-form-field">
                                    <label>{t('location')}</label>
                                    <div className="alert-input-with-icon" onClick={() => setShowMap(true)}>
                                        <input
                                            readOnly
                                            type="text"
                                            className="alert-premium-input alert-pr-icon"
                                            value={newAlert.location}
                                            placeholder="Click to select on map..."
                                        />
                                        <FaMapMarkerAlt className={`alert-input-icon-right ${newAlert.location ? 'active' : ''}`} />
                                    </div>
                                </div>

                                <div className="alert-type-switcher">
                                    <button
                                        className={`alert-type-btn alert-critical ${newAlert.type === 'critical' ? 'active alert-shadow-ruby' : ''}`}
                                        onClick={() => setNewAlert({ ...newAlert, type: 'critical' })}
                                    >
                                        <span className="alert-dot alert-pulse"></span>
                                        {t('critical')}
                                    </button>
                                    <button
                                        className={`alert-type-btn alert-warning ${newAlert.type === 'warning' ? 'active alert-shadow-gold' : ''}`}
                                        onClick={() => setNewAlert({ ...newAlert, type: 'warning' })}
                                    >
                                        <span className="alert-dot alert-bounce"></span>
                                        {t('warning')}
                                    </button>
                                </div>

                                <button
                                    className="alert-broadcast-btn"
                                    onClick={() => onSave(newAlert)}
                                    disabled={!newAlert.title || !newAlert.location}
                                >
                                    <FaCheck /> {t('broadcastAlert')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .alert-center-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.65);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                    padding: 1rem;
                }
                .alert-popup-card {
                    width: 100%;
                    background: #121214;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    color: white;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
                    animation: alertZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .alert-compact { max-width: 400px; }
                .alert-wide { max-width: 700px; }
                
                .alert-card-inner { padding: 2rem; }
                
                .alert-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .alert-header-title {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .alert-icon-badge {
                    padding: 0.75rem;
                    background: rgba(var(--primary-rgb), 0.15);
                    border: 1px solid rgba(var(--primary-rgb), 0.3);
                    border-radius: 1rem;
                    color: var(--primary);
                    font-size: 1.25rem;
                    display: flex;
                }
                .alert-header-title h2 {
                    font-size: 1.25rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: white;
                    margin: 0;
                }
                .alert-close-btn {
                    padding: 0.5rem;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.3);
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 1.25rem;
                }
                .alert-close-btn:hover { color: #f87171; transform: rotate(90deg); }

                .alert-form-field { margin-bottom: 1.5rem; }
                .alert-form-field label {
                    display: block;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: rgba(255, 255, 255, 0.4);
                    margin-bottom: 0.75rem;
                }
                .alert-premium-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.1rem 1.4rem;
                    font-size: 1rem;
                    font-weight: 600;
                    color: white;
                    outline: none;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                .alert-premium-input:focus {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.15);
                }
                
                .alert-input-with-icon { position: relative; cursor: pointer; }
                .alert-input-icon-right {
                    position: absolute;
                    right: 1.4rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.2);
                    transition: all 0.3s;
                }
                .alert-input-icon-right.active { color: var(--primary); }
                .alert-input-with-icon:hover .alert-premium-input { border-color: rgba(var(--primary-rgb), 0.5); }

                .alert-type-switcher {
                    display: flex;
                    gap: 1rem;
                    padding: 0.4rem;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 1.25rem;
                    margin-top: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .alert-type-btn {
                    flex: 1;
                    padding: 0.85rem;
                    border-radius: 1rem;
                    border: none;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.75rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                }
                .alert-type-btn.active { color: white; }
                .alert-type-btn.alert-critical.active { background: #991b1b; }
                .alert-type-btn.alert-warning.active { background: #92400e; }
                .alert-shadow-ruby { box-shadow: 0 10px 25px -5px rgba(153, 27, 27, 0.4); }
                .alert-shadow-gold { box-shadow: 0 10px 25px -5px rgba(146, 64, 14, 0.4); }
                
                .alert-dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; background: currentColor; opacity: 0.4; }
                .alert-type-btn.active .alert-dot { opacity: 1; background: white; }
                .alert-pulse { animation: alertPulse 1.5s infinite; }
                @keyframes alertPulse { 0% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.4; transform: scale(0.8); } }

                .alert-broadcast-btn {
                    width: 100%;
                    margin-top: 2rem;
                    padding: 1.25rem;
                    background: var(--primary);
                    border: none;
                    border-radius: 1.25rem;
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.25em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    transition: all 0.3s;
                    box-shadow: 0 20px 40px -10px rgba(var(--primary-rgb), 0.4);
                }
                .alert-broadcast-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-3px); }
                .alert-broadcast-btn:active:not(:disabled) { transform: translateY(0) scale(0.97); }
                .alert-broadcast-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .alert-map-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .alert-map-header h3 {
                    font-size: 0.85rem;
                    font-weight: 900;
                    color: var(--primary);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0;
                }
                .alert-back-link {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .alert-back-link:hover { color: white; text-decoration: underline; }
                .alert-map-render-area {
                    height: 350px;
                    width: 100%;
                    border-radius: 1.25rem;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
                    position: relative;
                }
                .alert-map-hint {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.3);
                    text-align: center;
                    margin-top: 1rem;
                }

                @keyframes alertZoomIn {
                    from { transform: scale(0.9) translateY(30px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .transition-fade { animation: alertFadeIn 0.4s ease-out forwards; }
                @keyframes alertFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                [dir="rtl"] .alert-popup-card { text-align: right; }
                [dir="rtl"] .alert-input-icon-right { right: auto; left: 1.4rem; }
            `}</style>
        </div>
    );
};

const AlertsPage = () => {
    const { t, language } = useLanguage();
    const { alerts, addAlert, toggleAlertStatus, editAlert, deleteAlert } = useAlerts();
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const startEdit = (alert) => {
        setEditingId(alert.id);
        setEditValue(alert.customTitle || t(alert.titleKey));
    };

    const saveEdit = (id) => {
        editAlert(id, { customTitle: editValue, titleKey: null });
        setEditingId(null);
    };

    const handleCreateAlert = (newAlertData) => {
        addAlert(newAlertData);
        setIsCreateModalOpen(false);
    };

    const handleDeleteAlert = (alert) => {
        if (window.confirm(`Are you sure you want to delete "${alert.customTitle || t(alert.titleKey)}"?`)) {
            deleteAlert(alert.id);
        }
    };

    return (
        <div className="alerts-dashboard animate-fade-in">
            <header className="alerts-hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="command-tag">
                            <span className="live-pulse red"></span>
                            Live Command Center
                        </div>
                        <h1 className="hero-title">
                            {t('systemAlerts')}
                            <span className="accent-dot">.</span>
                        </h1>
                        <p className="hero-subtitle">{t('manageBroadcasts')}</p>
                    </div>
                    <button
                        className="prime-create-btn"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <FaPlus />
                        <span>{t('createAlert')}</span>
                        <div className="glow-effect"></div>
                    </button>
                </div>
            </header>

            <div className="alerts-grid-container">
                <div className="grid-meta">
                    <span className="active-count">{alerts.filter(a => a.isActive).length} Active Channels</span>
                    <div className="separator"></div>
                    <span className="total-count">{alerts.length} Total Logs</span>
                </div>

                <div className="alerts-grid">
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`alert-card-prime ${alert.type} ${!alert.isActive ? 'is-inactive' : ''}`}
                        >
                            <div className="card-glass-base"></div>
                            <div className="card-border-glow"></div>

                            <div className="card-content">
                                <div className="card-top">
                                    <div className="alert-type-badge">
                                        <div className="badge-ring"></div>
                                        {t(alert.type || 'info')}
                                    </div>
                                    <div className="card-timestamp">
                                        <FaClock />
                                        {t(alert.timeKey)}
                                    </div>
                                </div>

                                <div className="card-main">
                                    {editingId === alert.id ? (
                                        <div className="edit-box-premium">
                                            <input
                                                autoFocus
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                            />
                                            <div className="edit-actions">
                                                <button onClick={() => saveEdit(alert.id)} className="confirm"><FaCheck /></button>
                                                <button onClick={() => setEditingId(null)} className="cancel"><FaTimes /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <h3 className="alert-name">
                                            {alert.customTitle || t(alert.titleKey)}
                                        </h3>
                                    )}
                                    <div className="alert-loc">
                                        <div className="loc-icon-hex"><FaMapMarkerAlt /></div>
                                        <span>{alert.customLocation || t(alert.locationKey)}</span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="action-strip">
                                        <button
                                            className="strip-btn edit"
                                            onClick={() => startEdit(alert)}
                                            disabled={!alert.isActive}
                                        >
                                            <FaEdit /> <span>{t('edit')}</span>
                                        </button>
                                        <div className="strip-divider"></div>
                                        <button
                                            className={`strip-btn status ${alert.isActive ? 'deactivate' : 'activate'}`}
                                            onClick={() => toggleAlertStatus(alert.id)}
                                        >
                                            <FaPowerOff /> <span>{alert.isActive ? t('deactivate') : t('activate')}</span>
                                        </button>
                                        <div className="strip-divider"></div>
                                        <button
                                            className="strip-btn delete"
                                            onClick={() => handleDeleteAlert(alert)}
                                        >
                                            <FaTrash /> <span>{t('delete')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CreateAlertModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateAlert}
                t={t}
            />

            <style>{`
                .alerts-dashboard {
                    min-height: 100vh;
                    padding: 2rem;
                    background: radial-gradient(circle at 0% 0%, rgba(var(--primary-rgb), 0.05) 0%, transparent 50%);
                }

                .alerts-hero {
                    max-width: 1400px;
                    margin: 0 auto 3rem auto;
                    padding: 0 1rem;
                }

                .hero-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding-bottom: 2rem;
                }

                .command-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 2rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 1.5rem;
                }

                .live-pulse {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    box-shadow: 0 0 10px #22c55e;
                    animation: pulseMarker 2s infinite;
                }
                .live-pulse.red { background: #ef4444; box-shadow: 0 0 10px #ef4444; }

                @keyframes pulseMarker {
                    0% { transform: scale(0.9); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.5; }
                }

                .hero-title {
                    font-size: 4rem;
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    color: white;
                    margin: 0;
                    line-height: 1;
                }

                .accent-dot { color: var(--primary); }

                .hero-subtitle {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.4);
                    margin-top: 0.75rem;
                    font-weight: 500;
                }

                .prime-create-btn {
                    position: relative;
                    padding: 1.25rem 2.5rem;
                    background: var(--primary);
                    border: none;
                    border-radius: 1rem;
                    color: white;
                    font-weight: 900;
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 20px 40px -10px rgba(var(--primary-rgb), 0.4);
                }

                .prime-create-btn:hover {
                    box-shadow: 0 25px 50px -10px rgba(var(--primary-rgb), 0.6);
                    transform: translateY(-4px);
                }

                .prime-create-btn:active { transform: translateY(0); }

                .glow-effect {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s;
                }
                .prime-create-btn:hover .glow-effect { opacity: 1; }

                .alerts-grid-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .grid-meta {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .active-count { color: var(--primary); }
                .total-count { color: rgba(255, 255, 255, 0.3); }
                .separator { width: 1px; height: 12px; background: rgba(255, 255, 255, 0.1); }

                .alerts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                    gap: 1.5rem;
                }

                .alert-card-prime {
                    position: relative;
                    border-radius: 1.5rem;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: default;
                }

                .card-glass-base {
                    position: absolute;
                    inset: 0;
                    background: rgba(28, 28, 30, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1.5rem;
                    z-index: 1;
                }

                .card-border-glow {
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    border-radius: 1.5rem;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent 50%, rgba(255,255,255,0.05));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    z-index: 2;
                    opacity: 0.5;
                    transition: opacity 0.4s;
                }

                .alert-card-prime:hover .card-border-glow { opacity: 1; }
                .alert-card-prime:hover { transform: translateY(-8px); }

                /* Card Color Variations */
                .alert-card-prime.critical .badge-ring { border-color: #ef4444; }
                .alert-card-prime.critical .alert-type-badge { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .alert-card-prime.critical:hover { box-shadow: 0 30px 60px -15px rgba(239, 68, 68, 0.15); }

                .alert-card-prime.warning .badge-ring { border-color: #f59e0b; }
                .alert-card-prime.warning .alert-type-badge { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .alert-card-prime.warning:hover { box-shadow: 0 30px 60px -15px rgba(245, 158, 11, 0.15); }

                .card-content {
                    position: relative;
                    z-index: 10;
                    padding: 2.25rem;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .alert-type-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.4rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                .badge-ring {
                    width: 8px;
                    height: 8px;
                    border: 2px solid currentColor;
                    border-radius: 50%;
                }

                .card-timestamp {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.25);
                }

                .card-main { margin-bottom: 2.5rem; flex-grow: 1; }

                .alert-name {
                    font-size: 1.8rem;
                    font-weight: 900;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                    color: white;
                    margin: 0 0 1rem 0;
                }

                .alert-loc {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                .loc-icon-hex {
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.75rem;
                    color: var(--primary);
                    font-size: 0.9rem;
                }

                .card-footer {
                    margin-top: auto;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .action-strip {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .strip-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 0.85rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .strip-divider { width: 1px; height: 24px; background: rgba(255, 255, 255, 0.05); }

                .strip-btn:hover {
                    background: rgba(255, 255, 255, 0.03);
                    color: white;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .strip-btn.status.deactivate:hover { border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
                .strip-btn.status.activate:hover { border-color: rgba(34, 197, 94, 0.3); color: #22c55e; }
                .strip-btn.delete:hover { border-color: rgba(239, 68, 68, 0.3); color: #ef4444; background: rgba(239, 68, 68, 0.05); }

                .alert-card-prime.is-inactive { opacity: 0.4; filter: grayscale(0.8); }
                .alert-card-prime.is-inactive:hover { opacity: 0.7; filter: grayscale(0.4); }

                /* Edit Mode */
                .edit-box-premium input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid var(--primary);
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    outline: none;
                }

                .edit-actions { display: flex; gap: 0.5rem; }
                .edit-actions button {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                    font-size: 0.8rem;
                    color: white;
                }
                .edit-actions .confirm { background: #22c55e; }
                .edit-actions .cancel { background: #ef4444; }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.5rem; }
                    .hero-content { flex-direction: column; align-items: flex-start; }
                    .alerts-grid { grid-template-columns: 1fr; }
                    .prime-create-btn { width: 100%; justify-content: center; }
                }

                [dir="rtl"] .hero-title { letter-spacing: 0; }
                [dir="rtl"] .alerts-hero { text-align: right; }
                [dir="rtl"] .alert-header-title { flex-direction: row-reverse; }
                [dir="rtl"] .alert-input-icon-right { right: auto; left: 1.4rem; }
            `}</style>
        </div>
    );
};

export default AlertsPage;
