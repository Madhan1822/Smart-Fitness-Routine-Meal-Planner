import pool from '../config/db.js';
import { generateWorkoutPlan, generateMealPlan } from '../utils/planGenerator.js';
export const getPlans = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [rows] = await pool.query('SELECT * FROM WorkoutMealPlans WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            // If no plans exist, generate them for the week
            const [user] = await pool.query('SELECT goal FROM Users WHERE id = ?', [userId]);
            if (user.length === 0)
                return res.status(404).json({ message: 'User not found' });
            const goal = user[0].goal;
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (const day of days) {
                const workout = generateWorkoutPlan(goal);
                const meal = generateMealPlan(goal);
                await pool.query('INSERT INTO WorkoutMealPlans (user_id, day, exercises, meals, completed_status) VALUES (?, ?, ?, ?, ?)', [userId, day, JSON.stringify(workout.exercises), JSON.stringify(meal.meals), JSON.stringify({ workout: false, meals: { breakfast: false, lunch: false, dinner: false, snacks: false } })]);
            }
            const [newRows] = await pool.query('SELECT * FROM WorkoutMealPlans WHERE user_id = ?', [userId]);
            return res.json(newRows);
        }
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updatePlanStatus = async (req, res) => {
    try {
        const { planId } = req.params;
        const { exercises, completed_status } = req.body;
        await pool.query('UPDATE WorkoutMealPlans SET exercises = ?, completed_status = ? WHERE id = ?', [JSON.stringify(exercises), JSON.stringify(completed_status), planId]);
        res.json({ message: 'Plan updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=planController.js.map