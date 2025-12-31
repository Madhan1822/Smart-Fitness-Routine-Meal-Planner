CREATE DATABASE IF NOT EXISTS smart_fitness_db;
USE smart_fitness_db;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    height FLOAT,
    weight FLOAT,
    goal ENUM('weight loss', 'muscle gain', 'maintenance'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS WorkoutMealPlans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    exercises JSON NOT NULL,
    meals JSON NOT NULL,
    completed_status JSON,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
