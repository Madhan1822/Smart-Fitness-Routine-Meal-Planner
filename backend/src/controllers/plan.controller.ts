import { Response } from 'express';
import { PlanService } from '../services/plan.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class PlanController {
    private planService: PlanService;

    constructor() {
        this.planService = new PlanService();
    }

    /**
     * Generate weekly workout and meal plans
     * POST /api/plans/generate
     */
    generatePlans = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { userId } = req.body;
            const plans = await this.planService.generatePlansForUser(userId);

            res.status(201).json({
                success: true,
                message: 'Weekly plans generated successfully',
                data: plans,
                count: plans.length
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to generate plans'
            });
        }
    };

    /**
     * Get all plans for a user
     * GET /api/plans/:userId
     */
    getPlansByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.userId);
            const plans = await this.planService.getPlansByUserId(userId);

            if (plans.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No plans found for this user. Please generate plans first.'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: plans,
                count: plans.length
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch plans'
            });
        }
    };

    /**
     * Get plan by ID
     * GET /api/plans/detail/:planId
     */
    getPlanById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const planId = parseInt(req.params.planId);
            const plan = await this.planService.getPlanById(planId);

            if (!plan) {
                res.status(404).json({
                    success: false,
                    message: 'Plan not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: plan
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch plan'
            });
        }
    };

    /**
     * Mark exercise as completed
     * PUT /api/plans/:planId/complete-exercise
     */
    completeExercise = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const planId = parseInt(req.params.planId);
            const { exerciseName } = req.body;

            const updatedPlan = await this.planService.completeExercise(planId, exerciseName);

            res.status(200).json({
                success: true,
                message: 'Exercise marked as completed',
                data: updatedPlan
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to complete exercise'
            });
        }
    };
}
