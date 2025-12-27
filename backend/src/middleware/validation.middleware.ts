import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserGoal, Gender } from '../types';

/**
 * Middleware to check validation results
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }

    next();
};

/**
 * Validation rules for creating a user
 */
export const validateCreateUser = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),

    body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 1, max: 120 })
        .withMessage('Age must be a positive number between 1 and 120'),

    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(Object.values(Gender))
        .withMessage('Gender must be either "male" or "female"'),

    body('height')
        .notEmpty()
        .withMessage('Height is required')
        .isFloat({ min: 50, max: 300 })
        .withMessage('Height must be a positive number between 50 and 300 cm'),

    body('weight')
        .notEmpty()
        .withMessage('Weight is required')
        .isFloat({ min: 20, max: 500 })
        .withMessage('Weight must be a positive number between 20 and 500 kg'),

    body('goal')
        .notEmpty()
        .withMessage('Goal is required')
        .isIn(Object.values(UserGoal))
        .withMessage('Goal must be one of: weight_loss, muscle_gain, maintenance'),

    validate
];

/**
 * Validation rules for updating a user
 */
export const validateUpdateUser = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid user ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),

    body('age')
        .optional()
        .isInt({ min: 1, max: 120 })
        .withMessage('Age must be a positive number between 1 and 120'),

    body('gender')
        .optional()
        .isIn(Object.values(Gender))
        .withMessage('Gender must be either "male" or "female"'),

    body('height')
        .optional()
        .isFloat({ min: 50, max: 300 })
        .withMessage('Height must be a positive number between 50 and 300 cm'),

    body('weight')
        .optional()
        .isFloat({ min: 20, max: 500 })
        .withMessage('Weight must be a positive number between 20 and 500 kg'),

    body('goal')
        .optional()
        .isIn(Object.values(UserGoal))
        .withMessage('Goal must be one of: weight_loss, muscle_gain, maintenance'),

    validate
];

/**
 * Validation rules for user ID parameter
 */
export const validateUserId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid user ID'),

    validate
];

/**
 * Validation rules for plan ID parameter
 */
export const validatePlanId = [
    param('planId')
        .isInt({ min: 1 })
        .withMessage('Invalid plan ID'),

    validate
];

/**
 * Validation rules for generating plans
 */
export const validateGeneratePlan = [
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1 })
        .withMessage('Invalid user ID'),

    validate
];

/**
 * Validation rules for completing exercise
 */
export const validateCompleteExercise = [
    param('planId')
        .isInt({ min: 1 })
        .withMessage('Invalid plan ID'),

    body('exerciseName')
        .trim()
        .notEmpty()
        .withMessage('Exercise name is required'),

    validate
];

/**
 * Validation rules for consuming meal
 */
export const validateConsumeMeal = [
    param('planId')
        .isInt({ min: 1 })
        .withMessage('Invalid plan ID'),

    body('mealType')
        .trim()
        .notEmpty()
        .withMessage('Meal type is required')
        .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
        .withMessage('Meal type must be one of: breakfast, lunch, dinner, snack'),

    validate
];

/**
 * Validation rules for adjusting meal
 */
export const validateAdjustMeal = [
    param('planId')
        .isInt({ min: 1 })
        .withMessage('Invalid plan ID'),

    body('mealType')
        .trim()
        .notEmpty()
        .withMessage('Meal type is required')
        .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
        .withMessage('Meal type must be one of: breakfast, lunch, dinner, snack'),

    body('adjustedCalories')
        .notEmpty()
        .withMessage('Adjusted calories is required')
        .isFloat({ min: 0, max: 5000 })
        .withMessage('Adjusted calories must be between 0 and 5000'),

    validate
];
