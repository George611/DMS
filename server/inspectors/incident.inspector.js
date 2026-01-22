/**
 * INCIDENT INSPECTOR
 * Validates the integrity and logic of incident reports before they touch the controller.
 * Prevents spam, nonsense data, and ensures critical fields are present.
 */

export const inspectIncident = (req, res, next) => {
    const { title, description, severity, type, location } = req.body;
    const errors = [];

    // 1. Critical Field Presence
    if (!title || !type || !location) {
        errors.push("Missing required fields: Title, Type, and Location are mandatory.");
    }

    // 2. Logic Validation
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (severity && !validSeverities.includes(severity.toLowerCase())) {
        errors.push(`Invalid severity level. Must be one of: ${validSeverities.join(', ')}`);
    }

    // 3. Spam/Nonsense Protection
    if (title && title.length < 5) {
        errors.push("Title is too short. Please provide a descriptive title.");
    }
    if (description && description.length > 1000) {
        errors.push("Description exceeds maximum length of 1000 characters.");
    }

    // 4. Injection Sanitization (Basic Check)
    const injectionPatterns = [/<script>/i, /javascript:/i, /onclick/i];
    if (injectionPatterns.some(pattern => pattern.test(title) || pattern.test(description) || pattern.test(location))) {
        errors.push("Security Alert: Potential script injection detected in incident data.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: 'inspection_failed',
            inspector: 'IncidentInspector',
            errors: errors
        });
    }

    next();
};
