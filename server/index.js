import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import pool from './config/db.js';
import { verifyToken } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);

// Dashboard Stats (Protected)
app.get('/api/stats/dashboard', verifyToken, async (req, res) => {
    try {
        const [totals] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status != 'resolved' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
            FROM incidents
        `);

        const [trends] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                SUM(CASE WHEN status != 'resolved' THEN 1 ELSE 0 END) as new,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
            FROM incidents
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        const [distribution] = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM incidents
            GROUP BY status
        `);

        const [recent] = await pool.query(`
            SELECT id, severity, type, location, created_at, status
            FROM incidents
            ORDER BY created_at DESC
            LIMIT 5
        `);

        res.json({
            summary: {
                active: totals[0].active || 0,
                resolved: totals[0].resolved || 0,
                total: totals[0].total || 0,
                personnel: 156,
                hospitals: 12,
                responseTime: '14m'
            },
            trends: trends,
            distribution: distribution,
            recent: recent
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

import { GoogleGenerativeAI } from '@google/generative-ai';
// AI Assistant (Protected)
app.post('/api/chat/gemini', verifyToken, async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.json({ text: "[MOCK AI] API Key missing." });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`System: DMS Assistant for Lebanon. User: ${message}`);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ message: 'AI Error' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
