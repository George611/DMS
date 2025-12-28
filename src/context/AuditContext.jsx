import { createContext, useContext, useState, useEffect } from 'react';

const AuditContext = createContext();

// Initial mock logs
const INITIAL_LOGS = [
    {
        id: 1,
        type: 'alert_created',
        user: 'Alex Commander',
        action: 'Created critical alert',
        details: 'Flash Flood Warning - District A',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        severity: 'critical'
    },
    {
        id: 2,
        type: 'resource_allocated',
        user: 'Sarah Connor',
        action: 'Allocated resources',
        details: '500 Food Packets to Warehouse A',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        severity: 'info'
    },
    {
        id: 3,
        type: 'user_login',
        user: 'John Rambo',
        action: 'User logged in',
        details: 'Volunteer access from 192.168.1.100',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        severity: 'info'
    }
];

export const AuditProvider = ({ children }) => {
    const [auditLogs, setAuditLogs] = useState(() => {
        const savedLogs = localStorage.getItem('dms_audit_logs');
        if (savedLogs) {
            try {
                return JSON.parse(savedLogs);
            } catch (e) {
                console.error("Failed to parse saved audit logs", e);
                return INITIAL_LOGS;
            }
        }
        return INITIAL_LOGS;
    });

    useEffect(() => {
        localStorage.setItem('dms_audit_logs', JSON.stringify(auditLogs));
    }, [auditLogs]);

    const addAuditLog = (logData) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...logData
        };
        setAuditLogs(prev => [newLog, ...prev]);
        return newLog;
    };

    const clearOldLogs = (daysToKeep = 30) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        setAuditLogs(prev => prev.filter(log =>
            new Date(log.timestamp) > cutoffDate
        ));
    };

    return (
        <AuditContext.Provider value={{ auditLogs, addAuditLog, clearOldLogs }}>
            {children}
        </AuditContext.Provider>
    );
};

export const useAudit = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAudit must be used within an AuditProvider');
    }
    return context;
};
