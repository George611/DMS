
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function test() {
    console.log('Testing connection to MySQL server (no DB selected)...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });
        console.log('SUCCESS: Connected to MySQL server!');

        // Check if DB exists
        const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
        if (rows.length > 0) {
            console.log(`SUCCESS: Database '${process.env.DB_NAME}' exists.`);
        } else {
            console.log(`WARNING: Database '${process.env.DB_NAME}' DOES NOT EXIST.`);
            // Try to create it
            try {
                await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
                console.log(`CREATED Database '${process.env.DB_NAME}'.`);
            } catch (createErr) {
                console.log(`FAILED to create database: ${createErr.message}`);
            }
        }

        await connection.end();
    } catch (err) {
        console.error('CONNECTION FAILED:', err.message);
        console.error('Code:', err.code);
    }
}

test();
