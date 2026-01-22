import express from 'express';
import {
    getIncidents,
    reportIncident,
    updateIncidentStatus,
    deleteIncident
} from '../controllers/incident.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All incident routes require authentication
router.use(verifyToken);

// 1. View Incidents (All roles)
router.get('/', getIncidents);

// 2. Report Incidents (Authority & Citizen)
router.post('/', checkRole(['authority', 'citizen']), reportIncident);

// 3. Update Status (Authority & Assigned Volunteers)
router.patch('/:id/status', checkRole(['authority', 'volunteer']), updateIncidentStatus);

// 4. Manage Incidents (Authority only)
router.delete('/:id', checkRole(['authority']), deleteIncident);

export default router;
