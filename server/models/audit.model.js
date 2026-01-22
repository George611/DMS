import pool from '../config/db.js';

export const Audit = {
    async log(data) {
        const { user_id, action, entity_type, entity_id, details, ip_address } = data;
        try {
            const [result] = await pool.query(
                'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
                [user_id, action, entity_type, entity_id, JSON.stringify(details || {}), ip_address || null]
            );
            return result.insertId;
        } catch (error) {
            console.error('Audit Logging Error:', error);
            // We don't throw here to avoid breaking the main request flow
            return null;
        }
    },

    async findAll() {
        const [rows] = await pool.query(`
            SELECT a.*, u.name as user_name, u.email as user_email
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 100
        `);
        return rows;
    }
};
