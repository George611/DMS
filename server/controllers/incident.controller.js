import { Incident } from '../models/incident.model.js';

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
        console.log('PATCH Request received for ID:', id, 'Body:', req.body);

        // Authorization logic
        const incident = await Incident.findById(id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });

        // Volunteers can only update if assigned to them
        if (req.user.role === 'volunteer' && incident.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'You can only update incidents assigned to you' });
        }

        await Incident.updateStatus(id, status, assigned_to);
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
};

export const deleteIncident = async (req, res) => {
    try {
        await Incident.delete(req.params.id);
        res.json({ message: 'Incident deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting incident' });
    }
};
