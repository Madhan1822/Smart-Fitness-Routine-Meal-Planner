import { Router } from 'express';
import { MealController } from '../controllers/meal.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
    validateConsumeMeal,
    validateAdjustMeal
} from '../middleware/validation.middleware';

const router = Router();
const mealController = new MealController();

/**
 * @route   PUT /api/meals/:planId/consume
 * @desc    Mark meal as consumed
 * @access  Private
 */
router.put('/:planId/consume', authenticate, validateConsumeMeal, mealController.consumeMeal);

/**
 * @route   PUT /api/meals/:planId/adjust
 * @desc    Adjust meal calories
 * @access  Private
 */
router.put('/:planId/adjust', authenticate, validateAdjustMeal, mealController.adjustMeal);

export default router;
