import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchIncidents = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/incidents');
            // Map incidents to the format expected by the frontend
            const mappedAlerts = response.data.map(inc => ({
                id: inc.id,
                title: inc.title,
                location: inc.location,
                type: inc.type,
                severity: inc.severity,
                status: inc.status,
                isActive: inc.status !== 'resolved',
                createdAt: inc.created_at,
                // Add keys for legacy translation support if needed
                titleKey: inc.title,
                locationKey: inc.location,
                timeKey: 'now'
            }));
            setAlerts(mappedAlerts);
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleNewIncident = (incident) => {
            const newAlert = {
                id: incident.id,
                title: incident.title,
                location: incident.location,
                type: incident.type,
                severity: incident.severity,
                status: incident.status,
                isActive: true,
                createdAt: incident.created_at
            };
            setAlerts(prev => [newAlert, ...prev]);
        };

        const handleStatusUpdate = ({ id, status }) => {
            setAlerts(prev => prev.map(alert =>
                alert.id === id ? { ...alert, status, isActive: status !== 'resolved' } : alert
            ));
        };

        socket.on('new_incident', handleNewIncident);
        socket.on('status_updated', handleStatusUpdate);

        return () => {
            socket.off('new_incident', handleNewIncident);
            socket.off('status_updated', handleStatusUpdate);
        };
    }, [socket]);

    const addAlert = async (newAlertData) => {
        // This is now handled by the ReportIncident page calling the api
        // But we can keep it for any frontend-only logic
        setTimeout(fetchIncidents, 1000);
    };

    const updateAlert = async (id, updatedData) => {
        try {
            await api.put(`/incidents/${id}`, updatedData);
            await fetchIncidents();
        } catch (error) {
            console.error("Failed to update incident", error);
            throw error;
        }
    };

    const toggleAlertStatus = async (id) => {
        const alert = alerts.find(a => a.id === id);
        if (!alert) return;

        const newStatus = alert.isActive ? 'resolved' : 'reported';
        try {
            await api.patch(`/incidents/${id}/status`, { status: newStatus });
            // Socket will handle the state update
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const deleteAlert = async (id) => {
        try {
            await api.delete(`/incidents/${id}`);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete incident", error);
        }
    };

    return (
        <AlertContext.Provider value={{ alerts, loading, addAlert, updateAlert, toggleAlertStatus, deleteAlert, fetchIncidents }}>
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
