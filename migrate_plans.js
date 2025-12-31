import pool from './src/config/db.js';

async function migrate() {
    try {
        await pool.query('ALTER TABLE WorkoutMealPlans ADD COLUMN is_approved BOOLEAN DEFAULT 0');
        console.log('✅ Column "is_approved" added to WorkoutMealPlans table');
    } catch (err) {
        console.log('ℹ️ Column "is_approved" might already exist.');
    }
    process.exit(0);
}

migrate();
