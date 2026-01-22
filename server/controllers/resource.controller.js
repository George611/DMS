import { Resource } from '../models/resource.model.js';
import { Audit } from '../models/audit.model.js';

export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources' });
    }
};

export const createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);

        await Audit.log({
            user_id: req.user.id,
            action: 'CREATE_RESOURCE',
            entity_type: 'resource',
            entity_id: resource.id,
            details: { name: resource.name, type: resource.type },
            ip_address: req.ip
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resource' });
    }
};

export const assignResource = async (req, res) => {
    try {
        const { incident_id, resource_id, quantity } = req.body;
        if (!incident_id || !resource_id || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await Resource.assignToIncident({ incident_id, resource_id, quantity });

        await Audit.log({
            user_id: req.user.id,
            action: 'ASSIGN_RESOURCE',
            entity_type: 'resource_assignment',
            entity_id: resource_id,
            details: { incident_id, quantity },
            ip_address: req.ip
        });

        res.json({ message: 'Resource assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error assigning resource' });
    }
};

export const getIncidentResources = async (req, res) => {
    try {
        const assignments = await Resource.getAssignmentsByIncident(req.params.incident_id);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments' });
    }
};
