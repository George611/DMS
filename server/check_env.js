
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const content = fs.readFileSync(envPath, 'utf-8');

content.split('\n').forEach(line => {
    if (line.startsWith('DB_PASS')) {
        console.log('DB_PASS=******');
    } else {
        console.log(line);
    }
});
