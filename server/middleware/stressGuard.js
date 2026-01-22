import rateLimit from 'express-rate-limit';
import { Audit } from '../models/audit.model.js';

/**
 * StressGuard: Advanced Rate Limiting & Server Protection
 * 
 * Prevents DDoS attacks and server exhaustion during high-stress 
 * disaster events by capping request volume per IP.
 */

// 1. General Stress Guard (Applied to all API routes)
export const generalStressGuard = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes (Reduced from 15 mins as requested)
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        message: 'System under heavy load. Please wait 2 mins before reuse.',
        code: 'STRESS_LIMIT_REACHED'
    },
    handler: async (req, res, next, options) => {
        // Log the stress event to our Audit system
        try {
            await Audit.log({
                user_id: req.user?.id || null,
                action: 'STRESS_GUARD_TRIGGERED',
                entity_type: 'system',
                details: {
                    ip: req.ip,
                    path: req.path,
                    method: req.method,
                    reason: 'Request limit exceeded'
                },
                ip_address: req.ip
            });
        } catch (e) {
            console.error('Failed to log stress alert:', e);
        }

        res.status(429).json(options.message);
    },
    // Bypass for Authorities (They need mission-critical access)
    skip: (req) => req.user?.role === 'authority',
});

// 2. Auth Stress Guard (Strict protection for Login/Register)
export const authStressGuard = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute (Reduced from 1 hour for better UX)
    max: 10, // Limit 10 attempts per minute
    message: {
        message: 'Too many login/registration attempts. Service locked for 1 min to protect your account.',
        code: 'AUTH_STRESS_LIMIT'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. AI Asset Guard (Protection for Gemini API usage)
export const aiStressGuard = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit 20 AI queries per hour
    message: {
        message: 'AI assistance quota reached for this hour.',
        code: 'AI_LIMIT'
    }
});
