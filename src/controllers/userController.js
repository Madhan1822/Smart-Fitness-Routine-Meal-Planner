import pool from '../config/db.js';
export const register = async (req, res) => {
    try {
        const { name, email, password, age, gender, height, weight, goal } = req.body;
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0)
            return res.status(400).json({ message: 'User already exists' });
        const [result] = await pool.query('INSERT INTO Users (name, email, password, age, gender, height, weight, goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, email, password, age, gender, height, weight, goal]);
        res.status(201).json({ id: result.insertId, name, email, goal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0)
            return res.status(401).json({ message: 'Invalid credentials' });
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, age, gender, height, weight, goal } = req.body;
        await pool.query('UPDATE Users SET name = ?, age = ?, gender = ?, height = ?, weight = ?, goal = ? WHERE id = ?', [name, age, gender, height, weight, goal, userId]);
        // If goal changed, we might want to reset the plans, but for now let's just update profile
        // Optional: clear WorkoutMealPlans if goal changed
        res.json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=userController.js.map