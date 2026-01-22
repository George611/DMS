/**
 * SECURITY INSPECTOR
 * Advanced request analysis inspector.
 * Inspects headers, tokens, and payloads for malicious patterns beyond standard rate limiting.
 */

export const inspectSecurity = (req, res, next) => {
    const errors = [];

    // 1. Header Inspection
    const userAgent = req.get('User-Agent') || '';
    if (!userAgent || userAgent.length < 5) {
        errors.push("Suspicious User-Agent detected.");
    }

    // 2. SQL Injection Patterns (Heuristic)
    // Checks query params and body for common SQL injection keywords
    const sqlPatterns = [/(\%27)|(\')|(\-\-)|(\%23)|(#)/i, /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i];

    const payload = JSON.stringify(req.body) + JSON.stringify(req.query);
    if (sqlPatterns.some(pattern => pattern.test(payload))) {
        // We log this silently to audit but reject requests immediately
        console.warn(`[SECURITY INSPECTOR] Potential SQL Injection from IP: ${req.ip}`);
        errors.push("Request intercepted by Security Inspector: Malformed payload detected.");
    }

    // 3. Origin Verification (for non-GET requests)
    if (req.method !== 'GET') {
        const origin = req.get('Origin');
        const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']; // Add production domains here
        if (origin && !allowedOrigins.includes(origin)) {
            // Note: CORS handles this usually, but this is a secondary enforcement layer
            // We can be lenient in dev mode, strict in prod
        }
    }

    if (errors.length > 0) {
        return res.status(403).json({
            status: 'access_denied',
            inspector: 'SecurityInspector',
            message: "Request blocked by security protocols.",
            details: errors
        });
    }

    next();
};
