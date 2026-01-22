import express from 'express';
import {
    getAllResources,
    createResource,
    updateResource,
    deleteResource,
    assignResource,
    getIncidentResources
} from '../controllers/resource.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// 1. View Resources (All roles)
router.get('/', getAllResources);

// 2. View Incident Assignments (All roles)
router.get('/incident/:incident_id', getIncidentResources);

// 3. Create/Manage Resources (Authority only)
router.post('/', checkRole(['authority']), createResource);
router.put('/:id', checkRole(['authority']), updateResource);
router.delete('/:id', checkRole(['authority']), deleteResource);

// 4. Assign Resources to Incidents (Authority & Volunteers)
router.post('/assign', checkRole(['authority', 'volunteer']), assignResource);

export default router;
