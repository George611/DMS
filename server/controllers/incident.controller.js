import { Incident } from '../models/incident.model.js';
import { Audit } from '../models/audit.model.js';
import { emitIncident, emitStatusUpdate } from '../services/socket.service.js';

export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.findAll();
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching incidents' });
    }
};

export const reportIncident = async (req, res) => {
    try {
        const incidentData = {
            ...req.body,
            reporter_id: req.user.id
        };
        const incident = await Incident.create(incidentData);

        // Real-time notification
        emitIncident(incident);

        await Audit.log({
            user_id: req.user.id,
            action: 'REPORT_INCIDENT',
            entity_type: 'incident',
            entity_id: incident.id,
            details: { title: incident.title, type: incident.type },
            ip_address: req.ip
        });

        res.status(201).json(incident);
    } catch (error) {
        console.error('Report Incident Error:', error);
        res.status(500).json({ message: 'Error reporting incident' });
    }
};

export const updateIncidentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assigned_to } = req.body;

        const incident = await Incident.findById(id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });

        if (req.user.role === 'volunteer' && incident.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'You can only update incidents assigned to you' });
        }

        const oldStatus = incident.status;
        await Incident.updateStatus(id, status, assigned_to);

        // Real-time notification
        emitStatusUpdate(id, status);

        await Audit.log({
            user_id: req.user.id,
            action: 'UPDATE_STATUS',
            entity_type: 'incident',
            entity_id: id,
            details: { old_status: oldStatus, new_status: status, assigned_to },
            ip_address: req.ip
        });

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
};

export const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        await Incident.delete(req.params.id);

        await Audit.log({
            user_id: req.user.id,
            action: 'DELETE_INCIDENT',
            entity_type: 'incident',
            entity_id: req.params.id,
            details: { title: incident?.title },
            ip_address: req.ip
        });

        res.json({ message: 'Incident deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting incident' });
    }
};
