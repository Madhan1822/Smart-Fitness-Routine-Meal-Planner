import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';
import { authenticate, requireOwnership } from '../middleware/auth.middleware';
import {
    validateGeneratePlan,
    validateCompleteExercise,
    validatePlanId
} from '../middleware/validation.middleware';

const router = Router();
const planController = new PlanController();

/**
 * @route   POST /api/plans/generate
 * @desc    Generate weekly workout and meal plans
 * @access  Private
 */
router.post('/generate', authenticate, validateGeneratePlan, planController.generatePlans);

/**
 * @route   GET /api/plans/:userId
 * @desc    Get all plans for a user
 * @access  Private (own data) or Admin
 */
router.get('/:userId', authenticate, requireOwnership, planController.getPlansByUserId);

/**
 * @route   GET /api/plans/detail/:planId
 * @desc    Get plan by ID
 * @access  Private
 */
router.get('/detail/:planId', authenticate, validatePlanId, planController.getPlanById);

/**
 * @route   PUT /api/plans/:planId/complete-exercise
 * @desc    Mark exercise as completed
 * @access  Private
 */
router.put(
    '/:planId/complete-exercise',
    authenticate,
    validateCompleteExercise,
    planController.completeExercise
);

export default router;
