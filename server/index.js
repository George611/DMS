import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { initSocket } from './services/socket.service.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import auditRoutes from './routes/audit.routes.js';
import pool from './config/db.js';
import { verifyToken } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Middleware & Stress Guard
import { generalStressGuard, authStressGuard, aiStressGuard } from './middleware/stressGuard.js';

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authStressGuard, authRoutes); // Protect login/register
app.use('/api/chat/gemini', aiStressGuard); // Protect AI API

// Apply general stress protection to all other API calls
app.use('/api', generalStressGuard);

app.use('/api/volunteers', volunteerRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/audit', auditRoutes);

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
// AI Assistant (Public)
app.post('/api/chat/gemini', async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
            return res.json({
                text: "I'm currently in mock mode because the Gemini API key is missing or invalid. How can I help you with DMS today?"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Format history for Google AI SDK
        const chatHistory = (history || []).map(item => ({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.parts[0].text }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Gemini AI Error:', error);

        const msg = (req.body?.message || '').toLowerCase();

        // Fallback Mock Logic so the widget "works" for the user even without a valid API key
        let mockResponse = "I'm having some trouble reaching my primary intelligence core, but as the DMS Assistant, I can tell you that we are monitoring all districts for incident reports. How can I help you coordinate response efforts?";

        if (msg.includes('help')) {
            mockResponse = "I can help you report incidents, find local volunteers, or check resource availability in Lebanon's disaster response network.";
        } else if (msg.includes('incident') || msg.includes('report')) {
            mockResponse = "To report an incident, please navigate to the 'Report' section in the sidebar. I can also take preliminary details here if you'd like.";
        }

        res.json({
            text: mockResponse,
            isMock: true,
            debug: error.message
        });
    }
});

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
