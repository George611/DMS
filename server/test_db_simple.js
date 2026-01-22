
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.join(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // Mask password for security in logs
    password: process.env.DB_PASS ? '***' : 'MISSING',
    database: process.env.DB_NAME
});

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        console.log('Successfully connected to database!');
        await connection.end();
    } catch (err) {
        console.error('Connection failed!');
        console.error('Error code:', err.code);
        console.error('Error number:', err.errno);
        console.error('Error message:', err.message);
        console.error('Full Error:', err);
    }
}

test();
