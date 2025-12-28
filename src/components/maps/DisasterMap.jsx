import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { useAlerts } from '../../context/AlertContext';
import { useLanguage } from '../../context/LanguageContext';
import { ALERTS as DEFAULT_ALERTS } from '../../utils/mockData';

// Fix Leaflet default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const getMarkerIcon = (type) => {
    const color = type === 'critical' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6';
    const isCritical = type === 'critical';

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-container ${isCritical ? 'critical-pulse' : ''}">
                <div class="marker-pin" style="background-color: ${color}; box-shadow: 0 0 10px ${color}88;">
                    <div class="marker-dot"></div>
                </div>
                ${isCritical ? `<div class="pulse-ring" style="border-color: ${color};"></div>` : ''}
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
};

const DisasterMap = () => {
    const { alerts } = useAlerts();
    const { t } = useLanguage();
    const [positionOffsets, setPositionOffsets] = useState({});

    // Generate random offset for dynamic movement
    const generateOffset = () => ({
        lat: (Math.random() - 0.5) * 0.02, // Random offset between -0.01 and 0.01
        lng: (Math.random() - 0.5) * 0.02
    });

    // Update positions every 30 seconds
    useEffect(() => {
        // Initialize offsets only for pre-existing (mock) alerts
        // User-created alerts (with customTitle) will remain fixed
        const initialOffsets = {};
        alerts.forEach(alert => {
            // Only add dynamic offsets to pre-existing alerts (those without customTitle)
            if (!alert.customTitle) {
                initialOffsets[alert.id] = generateOffset();
            }
        });
        setPositionOffsets(initialOffsets);

        // Set up interval to update positions for mock alerts only
        const interval = setInterval(() => {
            const newOffsets = {};
            alerts.forEach(alert => {
                if (!alert.customTitle) {
                    newOffsets[alert.id] = generateOffset();
                }
            });
            setPositionOffsets(newOffsets);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [alerts.length]); // Re-run when number of alerts changes

    const parseLocation = (loc, index, alertId) => {
        // Default base center - Beirut, Lebanon
        const defaultLat = 33.8938;
        const defaultLng = 35.5018;
        const offset = positionOffsets[alertId] || { lat: 0, lng: 0 };

        if (!loc) {
            return [
                defaultLat + (0.01 * index) + offset.lat,
                defaultLng + (0.01 * index) + offset.lng
            ];
        }

        // Check if it's a "lat, lng" string
        const parts = loc.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [lat + offset.lat, lng + offset.lng];
            }
        }

        // Otherwise return default with offset
        return [
            defaultLat + (0.01 * index) + offset.lat,
            defaultLng + (0.01 * index) + offset.lng
        ];
    };

    return (
        <div className="map-wrapper card">
            <MapContainer center={[33.8938, 35.5018]} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {alerts.filter(a => a.isActive).map((alert, idx) => (
                    <Marker
                        key={`${alert.id}-${positionOffsets[alert.id]?.lat || 0}`}
                        position={parseLocation(alert.customLocation || alert.locationKey, idx, alert.id)}
                        icon={getMarkerIcon(alert.type)}
                    >
                        <Popup className="premium-popup">
                            <div className="popup-content">
                                <span className={`popup-type ${alert.type}`}>{t(alert.type || 'info')}</span>
                                <h3>{alert.customTitle || t(alert.titleKey)}</h3>
                                <p>{alert.customLocation || t(alert.locationKey)}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Live Updates Indicator */}
            <div className="live-indicator">
                <span className="live-dot"></span>
                Live Updates (30s)
            </div>

            <style>{`
        .map-wrapper {
          height: 600px;
          border-radius: 1.5rem;
          overflow: hidden;
          background: rgba(18, 18, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          position: relative;
        }

        .custom-marker {
          background: none !important;
          border: none !important;
        }

        .marker-container {
          position: relative;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-pin {
          width: 14px;
          height: 14px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          position: relative;
          z-index: 2;
        }

        .marker-dot {
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pulse-ring {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid;
          border-radius: 50%;
          animation: markerPulse 2s infinite ease-out;
          opacity: 0;
          z-index: 1;
        }

        @keyframes markerPulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .premium-popup .leaflet-popup-content-wrapper {
          background: rgba(18, 18, 20, 0.95);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 0.5rem;
        }

        .premium-popup .leaflet-popup-tip {
          background: rgba(18, 18, 20, 0.95);
        }

        .popup-content h3 {
          margin: 0.5rem 0 0.25rem 0;
          font-weight: 800;
          font-size: 1rem;
        }

        .popup-content p {
          margin: 0;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .popup-type {
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          padding: 0.2rem 0.5rem;
          border-radius: 1rem;
        }

        .popup-type.critical { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .popup-type.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        /* Live Updates Indicator */
        .live-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          background: rgba(34, 197, 94, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: livePulse 2s infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        /* Smooth marker transitions */
        .leaflet-marker-icon {
          transition: all 2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        [dir="rtl"] .live-indicator {
          right: auto;
          left: 1rem;
        }
      `}</style>
        </div>
    );
};

export default DisasterMap;
