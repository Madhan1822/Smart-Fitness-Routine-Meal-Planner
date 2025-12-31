import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a pool for DB creation (no database specified)
const initPool = mysql.createPool(poolConfig);

// Main application pool
let appPool: mysql.Pool;

export const initDb = async () => {
    try {
        const dbName = process.env.DB_NAME || 'fitarc_db';

        // Step 1: Create Database if it doesn't exist
        await initPool.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database checked/created: ${dbName}`);

        // Step 2: Initialize the main app pool with the database
        appPool = mysql.createPool({
            ...poolConfig,
            database: dbName
        });

        // Step 3: Create Tables
        await appPool.execute(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                age INT,
                gender VARCHAR(50),
                height FLOAT,
                weight FLOAT,
                goal VARCHAR(100),
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await appPool.execute(`
            CREATE TABLE IF NOT EXISTS WorkoutMealPlans (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                day VARCHAR(50) NOT NULL,
                exercises JSON NOT NULL,
                meals JSON NOT NULL,
                completed_status JSON,
                is_approved TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ MySQL Tables initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing MySQL Database:', err);
    }
};

// Run initialization immediately
initDb();

export default {
    query: async (sql: string, params: any[] = []) => {
        try {
            // Ensure pool is initialized
            if (!appPool) {
                await initDb();
            }

            if (!appPool) {
                throw new Error('❌ MySQL Pool not initialized. Check your connection settings.');
            }

            const [result] = await appPool.query(sql, params);

            if (sql.trim().toUpperCase().startsWith('INSERT') ||
                sql.trim().toUpperCase().startsWith('UPDATE') ||
                sql.trim().toUpperCase().startsWith('DELETE')) {
                const res = result as any;
                return [{ insertId: res.insertId, affectedRows: res.affectedRows }];
            }

            return [result];
        } catch (err) {
            console.error('❌ Database Query Error:', err);
            throw err;
        }
    },
    execute: async (sql: string, params: any[] = []) => {
        try {
            if (!appPool) {
                await initDb();
            }
            if (!appPool) {
                throw new Error('❌ MySQL Pool not initialized. Check your connection settings.');
            }
            return await appPool.execute(sql, params);
        } catch (err) {
            console.error('❌ Database Execute Error:', err);
            throw err;
        }
    },
    getPool: () => appPool
};
