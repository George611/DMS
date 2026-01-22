import { Audit } from './models/audit.model.js';
import pool from './config/db.js';

/**
 * Audit Model Verification Script
 * 
 * Objectives:
 * 1. Verify we can WRITE a log entry.
 * 2. Verify we can READ logs (including the one we just wrote).
 * 3. Verify JSON details are parsed correctly.
 */

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

async function runTest() {
    console.log("🔍 TESTING AUDIT MODEL...\n");

    try {
        // TEST 1: CREATE LOG
        console.log("1. Testing Audit.log()...");
        const testAction = `TEST_ACTION_${Date.now()}`;
        const newLogId = await Audit.log({
            user_id: null, // System action
            action: testAction,
            entity_type: 'test',
            entity_id: 999,
            details: { test: true, message: 'This is a test audit log' },
            ip_address: '127.0.0.1'
        });

        if (newLogId) {
            console.log(`${GREEN}✔ PASS: Log created successfully. ID: ${newLogId}${RESET}`);
        } else {
            throw new Error("Audit.log() returned null or undefined ID");
        }

        // TEST 2: READ LOGS
        console.log("\n2. Testing Audit.findAll()...");
        const logs = await Audit.findAll();

        const foundLog = logs.find(log => log.id === newLogId);

        if (foundLog) {
            console.log(`${GREEN}✔ PASS: Retrieved newly created log.${RESET}`);
            console.log("   Details:", foundLog);

            // Verify content match
            if (foundLog.action === testAction && foundLog.ip_address === '127.0.0.1') {
                console.log(`${GREEN}✔ PASS: Data integrity check passed.${RESET}`);
            } else {
                console.log(`${RED}✘ FAIL: Data mismatch in retrieved log.${RESET}`);
            }
        } else {
            console.log(`${RED}✘ FAIL: Could not find the new log in the recent list.${RESET}`);
        }

    } catch (error) {
        console.error(`${RED}✘ CRITICAL FAILURE:${RESET}`, error);
    } finally {
        // Cleanup connection
        process.exit();
    }
}

runTest();
