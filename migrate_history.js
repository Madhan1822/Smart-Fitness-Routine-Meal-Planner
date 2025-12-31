import pool from './src/config/db.js';

async function migrate() {
    try {
        await pool.query('ALTER TABLE WorkoutMealPlans ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
        console.log('✅ Column "created_at" added to WorkoutMealPlans table');
    } catch (err) {
        console.log('ℹ️ Column "created_at" might already exist.');
    }
    process.exit(0);
}

migrate();
