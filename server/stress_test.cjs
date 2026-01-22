
const axios = require('axios');

/**
 * ATTACK SIMULATOR (STRESS TEST)
 * 
 * Attempts to break the server using:
 * 1. Brute Force Login Attack
 * 2. SQL Injection Attack
 * 3. High-Volume Incident Spam (DDoS)
 */

const BASE_URL = 'http://localhost:5001/api';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function runAttack() {
    console.log(`\n⚔️  STARTING SERVER STRESS TEST...\n`);

    // --- SCENARIO 1: SQL INJECTION ATTACK ---
    console.log(`${YELLOW}[TEST 1] Attempting SQL Injection...${RESET}`);
    try {
        await axios.post(`${BASE_URL}/auth/login`, {
            email: "' OR 1=1 --",
            password: "pwned"
        });
        console.log(`${RED}❌ FAILED: Server allowed SQL Injection!${RESET}`);
    } catch (err) {
        if (err.response && err.response.status === 403) {
            console.log(`${GREEN}🛡️ BLOCKED: Security Inspector caught the SQL payload.${RESET}`);
        } else {
            console.log(`${YELLOW}ℹ️ Rejected with status ${err.response?.status}: ${err.response?.data?.message || err.message}${RESET}`);
        }
    }

    // --- SCENARIO 2: BRUTE FORCE ATTACK ---
    console.log(`\n${YELLOW}[TEST 2] Simulating Brute Force (15 Login Attempts)...${RESET}`);
    let blockedCount = 0;
    const loginPromises = [];

    for (let i = 0; i < 15; i++) {
        loginPromises.push(
            axios.post(`${BASE_URL}/auth/login`, {
                email: `hacker_${i}@test.com`,
                password: `wrongpass${i}`
            }).catch(err => {
                if (err.response?.status === 429) blockedCount++;
                return err.response;
            })
        );
    }

    await Promise.all(loginPromises);

    if (blockedCount > 0) {
        console.log(`${GREEN}🛡️ BLOCKED: Auth Stress Guard triggered. ${blockedCount} requests rejected.${RESET}`);
    } else {
        console.log(`${RED}❌ FAILED: No rate limiting detected on login!${RESET}`);
    }


    // --- SCENARIO 3: INCIDENT SPAM (DDoS) ---
    console.log(`\n${YELLOW}[TEST 3] Flooding Incident API (DDoS Simulation)...${RESET}`);
    let floodBlocked = 0;
    const floodPromises = [];
    const packetSize = 120; // Send 120 requests (Limit is 100)

    for (let i = 0; i < packetSize; i++) {
        floodPromises.push(
            axios.get(`${BASE_URL}/incidents`)
                .catch(err => {
                    if (err.response?.status === 429) floodBlocked++;
                })
        );
    }

    await Promise.all(floodPromises);

    if (floodBlocked > 0) {
        console.log(`${GREEN}🛡️ BLOCKED: General Stress Guard triggered. ${floodBlocked} excess requests dropped.${RESET}`);
    } else {
        console.log(`${RED}❌ FAILED: Server allowed ${packetSize} requests instantly!${RESET}`);
    }

    console.log(`\n🏁 TEST COMPLETE.\n`);
}

runAttack();
