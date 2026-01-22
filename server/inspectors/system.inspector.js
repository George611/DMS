import os from 'os';

/**
 * SYSTEM INSPECTOR
 * Monitors the health of the Node.js process and server environment.
 * Can be used as a middleware to reject requests if the server is overheating or out of memory.
 */

export const inspectSystemHealth = (req, res, next) => {
    // 1. Memory Check
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    const maxMemory = 500; // Threshold: 500MB (adjust based on server size)

    if (usedMemory > maxMemory) {
        console.error(`[SYSTEM INSPECTOR] CRITICAL: Memory usage high (${Math.round(usedMemory)}MB). Shedding load.`);
        return res.status(503).json({
            status: 'service_unavailable',
            inspector: 'SystemInspector',
            message: 'Server is currently experiencing heavy load. Please retry in 30 seconds.'
        });
    }

    // 2. Load Average Check (Linux/macOS only - Windows returns [0,0,0])
    const loadAvg = os.loadavg();
    // If 1-minute load average is > numCPUs * 2, we are overloaded
    if (loadAvg[0] > os.cpus().length * 2) {
        return res.status(503).json({
            status: 'overloaded',
            inspector: 'SystemInspector',
            message: 'System processing capacity exceeded.'
        });
    }

    next();
};
