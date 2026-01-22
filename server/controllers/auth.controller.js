import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check if user exists
        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert user
        const [userResult] = await connection.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        const userId = userResult.insertId;

        // 4. Get Role ID
        const [roleRows] = await connection.query('SELECT id FROM roles WHERE name = ?', [role || 'citizen']);
        if (roleRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid role' });
        }
        const roleId = roleRows[0].id;

        // 5. Assign Role
        await connection.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

        await connection.commit();

        const token = jwt.sign({ id: userId, role: role || 'citizen' }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(201).json({
            token,
            user: { id: userId, name, email, role: role || 'citizen' }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    } finally {
        connection.release();
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            `
      SELECT u.id, u.name, u.email, u.password, r.name AS role
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE u.email = ?
      `,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
