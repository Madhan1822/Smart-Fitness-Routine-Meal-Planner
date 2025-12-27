import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authenticate, requireOwnership } from '../middleware/auth.middleware';

const router = Router();
const progressController = new ProgressController();

/**
 * @route   GET /api/progress/:userId
 * @desc    Get progress summary for a user
 * @access  Private (own data) or Admin
 */
router.get('/:userId', authenticate, requireOwnership, progressController.getProgress);

/**
 * @route   GET /api/progress/:userId/day/:day
 * @desc    Get daily summary
 * @access  Private (own data) or Admin
 */
router.get('/:userId/day/:day', authenticate, requireOwnership, progressController.getDailySummary);

/**
 * @route   GET /api/progress/:userId/calories-burned
 * @desc    Get total calories burned
 * @access  Private (own data) or Admin
 */
router.get(
    '/:userId/calories-burned',
    authenticate,
    requireOwnership,
    progressController.getCaloriesBurned
);

export default router;
