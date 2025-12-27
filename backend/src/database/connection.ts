import mysql from 'mysql2/promise';
import { config } from '../config';

// Create connection pool
export const pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
export const testConnection = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected Successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};

// Initialize database tables
export const initializeDatabase = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();

        // Create Users table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender ENUM('male', 'female') NOT NULL,
        height DECIMAL(5,2) NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL,
        role ENUM('USER', 'ADMIN') DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_role (role),
        INDEX idx_goal (goal)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

        // Create WorkoutMealPlans table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS WorkoutMealPlans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        day VARCHAR(20) NOT NULL,
        exercises JSON NOT NULL,
        meals JSON NOT NULL,
        completed_status JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        INDEX idx_user_day (user_id, day),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

        console.log('✅ Database tables initialized successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
