import type { Request, Response } from 'express';
import pool from '../config/db.js';
import { generateWorkoutPlan, generateMealPlan } from '../utils/planGenerator.js';

export const getPlans = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        let [rows]: any = await pool.query('SELECT * FROM WorkoutMealPlans WHERE user_id = ?', [userId]);

        if (rows.length === 0) {
            const [users]: any = await pool.query('SELECT goal FROM Users WHERE id = ?', [userId]);
            if (users.length === 0) return res.status(404).json({ message: 'User not found' });

            const goal = users[0].goal || 'weight loss';
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            for (const day of days) {
                const workout = generateWorkoutPlan(goal);
                const meal = generateMealPlan(goal);
                await pool.query(
                    'INSERT INTO WorkoutMealPlans (user_id, day, exercises, meals, completed_status, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
                    [userId, day,
                        JSON.stringify(workout.exercises),
                        JSON.stringify(meal.meals),
                        JSON.stringify({ meals: { breakfast: false, lunch: false, dinner: false, snacks: false } }),
                        0
                    ]
                );
            }

            const [newRows]: any = await pool.query('SELECT * FROM WorkoutMealPlans WHERE user_id = ?', [userId]);
            rows = newRows;
        }

        // Safe JSON Parse Helper
        const safeParse = (val: any) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return val; }
            }
            return val;
        };

        const result = rows.map((r: any) => ({
            ...r,
            exercises: safeParse(r.exercises),
            meals: safeParse(r.meals),
            completed_status: safeParse(r.completed_status)
        }));

        res.json(result);
    } catch (error: any) {
        console.error('Plan Fetch Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updatePlanStatus = async (req: Request, res: Response) => {
    try {
        const { planId } = req.params;
        const { exercises, completed_status, meals, is_approved } = req.body;

        const updates: string[] = [];
        const params: any[] = [];

        if (exercises) {
            updates.push('exercises = ?');
            params.push(JSON.stringify(exercises));
        }
        if (completed_status) {
            updates.push('completed_status = ?');
            params.push(JSON.stringify(completed_status));
        }
        if (meals) {
            updates.push('meals = ?');
            params.push(JSON.stringify(meals));
        }
        if (is_approved !== undefined) {
            updates.push('is_approved = ?');
            params.push(is_approved ? 1 : 0);
        }

        if (updates.length > 0) {
            params.push(planId);
            await pool.query(`UPDATE WorkoutMealPlans SET ${updates.join(', ')} WHERE id = ?`, params);
        }

        res.json({ message: 'Plan updated successfully' });
    } catch (error: any) {
        console.error('Plan Update Error:', error);
        res.status(500).json({ message: error.message });
    }
};
