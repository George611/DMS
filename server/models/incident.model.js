import pool from '../config/db.js';

export const Incident = {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM incidents ORDER BY created_at DESC');
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM incidents WHERE id = ?', [id]);
        return rows[0];
    },

    async create(data) {
        const { title, description, type, severity, location, reporter_id } = data;
        console.log('Incoming Incident Data:', data);
        const [result] = await pool.query(
            'INSERT INTO incidents (title, description, type, severity, location, reporter_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, type, severity, location, reporter_id]
        );
        return { id: result.insertId, ...data };
    },

    async updateStatus(id, status, assigned_to = null) {
        let query = 'UPDATE incidents SET status = ?';
        const params = [status];

        if (assigned_to !== null) {
            query += ', assigned_to = ?';
            params.push(assigned_to);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.query(query, params);
        return true;
    },

    async update(id, data) {
        const { title, description, type, severity, location } = data;
        await pool.query(
            'UPDATE incidents SET title = ?, description = ?, type = ?, severity = ?, location = ? WHERE id = ?',
            [title, description, type, severity, location, id]
        );
        return { id, ...data };
    },

    async delete(id) {
        await pool.query('DELETE FROM incidents WHERE id = ?', [id]);
        return true;
    }
};
