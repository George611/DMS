import pool from './config/db.js';

async function setupIncidents() {
    try {
        console.log('--- SETTING UP INCIDENTS TABLE ---');

        // 1. Create incidents table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS incidents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
                status ENUM('reported', 'investigating', 'responding', 'resolved') DEFAULT 'reported',
                location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table created or verified.');

        // 2. Clear old test data
        await pool.query('DELETE FROM incidents');

        // 3. Insert mock data for the last 7 days
        const statuses = ['reported', 'investigating', 'responding', 'resolved'];
        const types = ['Flash Flood', 'Wildfire', 'Power Outage', 'Structure Fire', 'Medical Emergency'];
        const severities = ['low', 'medium', 'high', 'critical'];

        const now = new Date();
        const batch = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Random number of incidents per day
            const dailyCount = Math.floor(Math.random() * 10) + 5;

            for (let j = 0; j < dailyCount; j++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const severity = severities[Math.floor(Math.random() * severities.length)];

                // Construct a randomized timestamp for this day
                const hour = Math.floor(Math.random() * 24);
                const min = Math.floor(Math.random() * 60);
                const timestamp = `${dateStr} ${hour}:${min}:00`;

                batch.push([type, severity, status, `District ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`, timestamp]);
            }
        }

        await pool.query(
            'INSERT INTO incidents (type, severity, status, location, created_at) VALUES ?',
            [batch]
        );

        console.log(`Inserted ${batch.length} mock incidents.`);
        console.log('--- SETUP COMPLETE ---');
        process.exit(0);
    } catch (error) {
        console.error('Setup failed:', error.message);
        process.exit(1);
    }
}

setupIncidents();
