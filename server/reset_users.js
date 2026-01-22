import pool from './config/db.js';
import bcrypt from 'bcryptjs';

async function resetUsers() {
    try {
        console.log('--- RESETTING USERS ---');

        // 1. Delete existing users to ensure fresh start
        await pool.query('DELETE FROM users WHERE email IN (?, ?, ?)',
            ['admin@dms.com', 'volunteer@dms.com', 'citizen@dms.com']);

        const users = [
            { name: 'System Admin', email: 'admin@dms.com', password: 'Password123!', role: 'authority' },
            { name: 'John Volunteer', email: 'volunteer@dms.com', password: 'Password123!', role: 'volunteer' },
            { name: 'Jane Citizen', email: 'citizen@dms.com', password: 'Password123!', role: 'citizen' }
        ];

        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [user.name, user.email, hashedPassword, user.role]
            );
            console.log(`User reset: ${user.email}`);
        }

        const [dbUsers] = await pool.query('SELECT email FROM users');
        console.log('Current users in DB:', dbUsers.map(u => u.email));

        console.log('--- RESET COMPLETE ---');
        process.exit(0);
    } catch (error) {
        console.error('Reset failed:', error);
        process.exit(1);
    }
}

resetUsers();
