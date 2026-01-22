import pool from '../config/db.js';

export const Volunteer = {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM volunteers ORDER BY created_at DESC');
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM volunteers WHERE id = ?', [id]);
        return rows[0];
    },

    async create(data) {
        const { name, email, specialization, status } = data;
        const [result] = await pool.query(
            'INSERT INTO volunteers (name, email, specialization, status) VALUES (?, ?, ?, ?)',
            [name, email, specialization, status || 'active']
        );
        return { id: result.insertId, ...data };
    },

    async update(id, data) {
        const { name, email, specialization, status } = data;
        await pool.query(
            'UPDATE volunteers SET name = ?, email = ?, specialization = ?, status = ? WHERE id = ?',
            [name, email, specialization, status, id]
        );
        return { id, ...data };
    },

    async delete(id) {
        await pool.query('DELETE FROM volunteers WHERE id = ?', [id]);
        return true;
    }
};
