import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key:', apiKey ? 'Loaded' : 'Missing');
        if (!apiKey) return;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (error) {
        console.error('Gemini Error:', error);
    }
}

testGemini();
