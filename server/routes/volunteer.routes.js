import express from 'express';
import {
    getAllVolunteers,
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer
} from '../controllers/volunteer.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Publicly accessible for now, or add verifyToken if needed
router.get('/', verifyToken, getAllVolunteers);
router.get('/:id', verifyToken, getVolunteerById);
router.post('/', verifyToken, checkRole(['authority']), createVolunteer);
router.put('/:id', verifyToken, checkRole(['authority']), updateVolunteer);
router.delete('/:id', verifyToken, checkRole(['authority']), deleteVolunteer);

export default router;
