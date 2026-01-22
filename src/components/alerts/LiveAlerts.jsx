import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaBell, FaInfoCircle, FaTimes } from 'react-icons/fa';

const LiveAlerts = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handleNewIncident = (incident) => {
            const newNotif = {
                id: Date.now(),
                type: 'incident',
                title: 'New Incident Reported',
                message: `${incident.title} in ${incident.location}`,
                severity: incident.severity,
                timestamp: new Date()
            };
            addNotification(newNotif);
        };

        const handleAdminNotification = (data) => {
            const newNotif = {
                id: Date.now(),
                type: 'admin',
                title: 'Priority Alert',
                message: data.message,
                severity: data.incident.severity,
                timestamp: new Date()
            };
            addNotification(newNotif);
        };

        const handleStatusUpdate = (data) => {
            const newNotif = {
                id: Date.now(),
                type: 'status',
                title: 'Incident Update',
                message: `Incident #${data.id} is now ${data.status}`,
                severity: 'info',
                timestamp: new Date()
            };
            addNotification(newNotif);
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

    const addNotification = (notif) => {
        setNotifications(prev => [notif, ...prev].slice(0, 5));

        // Auto-remove after 8 seconds
        setTimeout(() => {
            removeNotification(notif.id);
        }, 8000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-20 right-4 z-[9999] w-80 space-y-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md flex gap-3 ${n.severity === 'high' || n.severity === 'critical'
                                ? 'bg-red-500/90 border-red-400 text-white'
                                : n.type === 'admin'
                                    ? 'bg-amber-500/90 border-amber-400 text-white'
                                    : 'bg-slate-800/90 border-slate-700 text-white'
                            }`}
                    >
                        <div className="flex-shrink-0 mt-1">
                            {n.severity === 'high' ? <FaExclamationTriangle className="text-xl" /> : <FaBell className="text-xl" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm leading-tight">{n.title}</h4>
                            <p className="text-xs opacity-90 mt-1">{n.message}</p>
                            <span className="text-[10px] opacity-70 block mt-2">Just now</span>
                        </div>
                        <button
                            onClick={() => removeNotification(n.id)}
                            className="flex-shrink-0 self-start opacity-60 hover:opacity-100"
                        >
                            <FaTimes />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default LiveAlerts;
