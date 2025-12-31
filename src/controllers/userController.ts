import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, age, gender, height, weight, goal } = req.body;

        // Check if user exists
        const [existing]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const role = req.body.role || 'user';

        const [result]: any = await pool.query(
            'INSERT INTO Users (name, email, password, age, gender, height, weight, goal, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, password, age, gender, height, weight, goal, role]
        );

        res.status(201).json({ id: result.insertId, name, email, goal, role });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const [rows]: any = await pool.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password]);

        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        res.json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const [rows]: any = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);

        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { name, age, gender, height, weight, goal } = req.body;

        // Check if goal changed
        const [user]: any = await pool.query('SELECT goal FROM Users WHERE id = ?', [userId]);
        if (user.length > 0 && user[0].goal !== goal) {
            // Reset plans for the new goal
            await pool.query('DELETE FROM WorkoutMealPlans WHERE user_id = ?', [userId]);
        }

        await pool.query(
            'UPDATE Users SET name = ?, age = ?, gender = ?, height = ?, weight = ?, goal = ? WHERE id = ?',
            [name, age, gender, height, weight, goal, userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query('SELECT id, name, email, goal, role, created_at FROM Users');
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
