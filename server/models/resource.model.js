import pool from '../config/db.js';

export const Resource = {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM resources ORDER BY type ASC');
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);
        return rows[0];
    },

    async create(data) {
        const { name, type, total_quantity, unit, location, status } = data;
        const [result] = await pool.query(
            'INSERT INTO resources (name, type, total_quantity, available_quantity, unit, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, type, total_quantity, total_quantity, unit || 'units', location, status || 'available']
        );
        return { id: result.insertId, ...data };
    },

    async update(id, data) {
        const { name, type, total_quantity, unit, location, status } = data;
        // In a real app, you'd calculate available_quantity based on assignments
        await pool.query(
            'UPDATE resources SET name=?, type=?, total_quantity=?, unit=?, location=?, status=? WHERE id=?',
            [name, type, total_quantity, unit, location, status, id]
        );
        return { id, ...data };
    },

    async assignToIncident(assignmentData) {
        const { incident_id, resource_id, quantity } = assignmentData;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Check availability
            const [resource] = await connection.query('SELECT available_quantity FROM resources WHERE id = ? FOR UPDATE', [resource_id]);
            if (!resource.length || resource[0].available_quantity < quantity) {
                throw new Error('Insufficient resource quantity available');
            }

            // 2. Create assignment
            await connection.query(
                'INSERT INTO resource_assignments (incident_id, resource_id, quantity) VALUES (?, ?, ?)',
                [incident_id, resource_id, quantity]
            );

            // 3. Update available quantity
            await connection.query(
                'UPDATE resources SET available_quantity = available_quantity - ? WHERE id = ?',
                [quantity, resource_id]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getAssignmentsByIncident(incidentId) {
        const [rows] = await pool.query(`
            SELECT ra.*, r.name as resource_name, r.unit
            FROM resource_assignments ra
            JOIN resources r ON ra.resource_id = r.id
            WHERE ra.incident_id = ?
        `, [incidentId]);
        return rows;
    }
};
