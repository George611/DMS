import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaBell, FaInfoCircle, FaTimes, FaShieldAlt, FaBoxOpen } from 'react-icons/fa';

/**
 * Premium Live Notification System
 * Features: Glassmorphism, Animated Progress, Contextual Styling, Sound Alerts
 */
const LiveAlerts = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState([]);
    const audioRef = useRef(null);
    const sirenRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        sirenRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3');

        if (!socket) return;

        const handleNewIncident = (incident) => {
            const sev = incident.severity?.toLowerCase();
            createNotification({
                type: 'incident',
                title: 'Emergency: New Incident',
                message: `${incident.title} @ ${incident.location}`,
                severity: sev,
                icon: <FaExclamationTriangle />
            });
            playNotificationSound(sev);
        };

        const handleAdminNotification = (data) => {
            const sev = data.incident?.severity?.toLowerCase() || (data.type === 'inventory' ? 'info' : 'high');
            createNotification({
                type: data.type === 'inventory' ? 'inventory' : 'admin',
                title: data.type === 'inventory' ? 'Inventory Protocol' : 'Authority Alert',
                message: data.message,
                severity: sev,
                icon: data.type === 'inventory' ? <FaBoxOpen /> : <FaShieldAlt />
            });
            playNotificationSound(sev);
        };

        const handleStatusUpdate = (data) => {
            createNotification({
                type: 'status',
                title: 'Operational Update',
                message: `Task #${data.id} shifted to ${data.status.toUpperCase()}`,
                severity: 'info',
                icon: <FaInfoCircle />
            });
            playNotificationSound('info');
        };

        socket.on('new_incident', handleNewIncident);
        socket.on('admin_notification', handleAdminNotification);
        socket.on('status_updated', handleStatusUpdate);

        return () => {
            socket.off('new_incident', handleNewIncident);
            socket.off('admin_notification', handleAdminNotification);
            socket.off('status_updated', handleStatusUpdate);
        };
    }, [socket]);

    const playNotificationSound = (severity) => {
        try {
            const sound = (severity === 'high' || severity === 'critical') ? sirenRef.current : audioRef.current;
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(() => { });
            }
        } catch (err) { }
    };

    const createNotification = (config) => {
        const id = Date.now();
        const notification = {
            id,
            duration: (config.severity === 'critical' || config.severity === 'high') ? 12000 : 8000,
            ...config,
            timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date())
        };

        setNotifications(prev => [notification, ...prev].slice(0, 4));

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, notification.duration);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-6 right-6 z-[10000] w-[380px] space-y-4 pointer-events-none" style={{ perspective: '1000px' }}>
            <AnimatePresence mode="popLayout">
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, x: 100, rotateY: 15, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.8, transition: { duration: 0.3 } }}
                        className={`pointer-events-auto relative overflow-hidden group premium-toast ${n.severity}`}
                    >
                        {/* Glass Effect Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                        <div className="relative flex items-center gap-4 p-5">
                            {/* Animated Icon Container */}
                            <div className={`toast-icon-box ${n.severity}`}>
                                {n.icon}
                                {(n.severity === 'high' || n.severity === 'critical') && (
                                    <div className="absolute inset-0 animate-ping rounded-full bg-current opacity-20" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{n.title}</span>
                                    <span className="text-[9px] opacity-40 font-mono">{n.timestamp}</span>
                                </div>
                                <p className="text-sm font-bold text-white leading-tight mb-1">{n.message}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`severity-tag ${n.severity}`}>{n.severity}</span>
                                    {n.type === 'inventory' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase">LOGISTICS</span>}
                                </div>
                            </div>

                            <button
                                onClick={() => removeNotification(n.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors opacity-40 hover:opacity-100"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Progress Bar Loader */}
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: n.duration / 1000, ease: 'linear' }}
                            className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${n.severity === 'critical' ? 'from-red-500 to-orange-500' :
                                    n.severity === 'high' ? 'from-orange-500 to-yellow-500' :
                                        'from-blue-500 to-cyan-500'
                                }`}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            <style>{`
                .premium-toast {
                    background: rgba(15, 15, 18, 0.85);
                    backdrop-filter: blur(25px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5),
                                inset 0 0 0 1px rgba(255, 255, 255, 0.05);
                    border-radius: 1.25rem;
                }

                .premium-toast.critical { border-left: 4px solid #ff4d4d; background: rgba(30, 10, 10, 0.9); }
                .premium-toast.high { border-left: 4px solid #ff9f43; }
                .premium-toast.info { border-left: 4px solid #00d2ff; }

                .toast-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    position: relative;
                }

                .toast-icon-box.critical { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; box-shadow: 0 0 20px rgba(255, 77, 77, 0.2); }
                .toast-icon-box.high { background: rgba(255, 159, 67, 0.1); color: #ff9f43; }
                .toast-icon-box.info { background: rgba(0, 210, 255, 0.1); color: #00d2ff; }

                .severity-tag {
                    font-size: 8px;
                    font-weight: 900;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                    letter-spacing: 0.1em;
                }
                .severity-tag.critical { background: #ff4d4d; color: white; }
                .severity-tag.high { background: #ff9f43; color: white; }
                .severity-tag.info { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.6); }
            `}</style>
        </div>
    );
};

export default LiveAlerts;
