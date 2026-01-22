import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function verify() {
    try {
        const email = 'volunteer@dms.com';
        const rawPassword = 'Password123!';

        console.log(`Checking ${email}...`);
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log('User not found in DB!');
            process.exit(1);
        }

        const user = users[0];
        console.log('User found. Hashed password in DB:', user.password);

        const isMatch = await bcrypt.compare(rawPassword, user.password);
        console.log('Bcrypt comparison result:', isMatch ? 'MATCH' : 'FAIL');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

verify();
