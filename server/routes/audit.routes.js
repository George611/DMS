import express from 'express';
import { Audit } from '../models/audit.model.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkRole(['authority']));

router.get('/', async (req, res) => {
    try {
        const logs = await Audit.findAll();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
});

export default router;
