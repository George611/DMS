import { createContext, useContext, useState, useEffect } from 'react';
import { ALERTS as MOCK_ALERTS } from '../utils/mockData';
import { useAudit } from './AuditContext';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const auditContext = useAudit();
    const [alerts, setAlerts] = useState(() => {
        const savedAlerts = localStorage.getItem('dms_alerts');
        if (savedAlerts) {
            try {
                return JSON.parse(savedAlerts);
            } catch (e) {
                console.error("Failed to parse saved alerts", e);
                return MOCK_ALERTS.map(a => ({ ...a, isActive: true }));
            }
        }
        return MOCK_ALERTS.map(a => ({ ...a, isActive: true }));
    });

    useEffect(() => {
        localStorage.setItem('dms_alerts', JSON.stringify(alerts));
    }, [alerts]);

    const addAlert = (newAlertData) => {
        const newAlert = {
            id: Date.now(),
            ...newAlertData,
            customTitle: newAlertData.title,
            customLocation: newAlertData.location,
            isActive: true,
            timeKey: 'now'
        };
        setAlerts(prev => [newAlert, ...prev]);

        // Log to audit
        if (auditContext) {
            auditContext.addAuditLog({
                type: 'alert_created',
                user: 'Alex Commander', // In production, get from auth context
                action: `Created ${newAlertData.type} alert`,
                details: `${newAlertData.title} - ${newAlertData.location}`,
                severity: newAlertData.type === 'critical' ? 'critical' : newAlertData.type === 'warning' ? 'warning' : 'info'
            });
        }

        return newAlert;
    };

    const toggleAlertStatus = (id) => {
        const alert = alerts.find(a => a.id === id);
        setAlerts(prev => prev.map(alert =>
            alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
        ));

        // Log to audit
        if (auditContext && alert) {
            auditContext.addAuditLog({
                type: 'alert_deactivated',
                user: 'Alex Commander',
                action: alert.isActive ? 'Deactivated alert' : 'Activated alert',
                details: `${alert.customTitle || alert.titleKey}`,
                severity: 'warning'
            });
        }
    };

    const editAlert = (id, updates) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === id ? { ...alert, ...updates } : alert
        ));
    };

    const deleteAlert = (id) => {
        const alert = alerts.find(a => a.id === id);
        setAlerts(prev => prev.filter(alert => alert.id !== id));

        // Log to audit
        if (auditContext && alert) {
            auditContext.addAuditLog({
                type: 'alert_deleted',
                user: 'Alex Commander',
                action: 'Deleted alert',
                details: `${alert.customTitle || alert.titleKey}`,
                severity: 'warning'
            });
        }
    };

    return (
        <AlertContext.Provider value={{ alerts, addAlert, toggleAlertStatus, editAlert, deleteAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlerts must be used within an AlertProvider');
    }
    return context;
};
