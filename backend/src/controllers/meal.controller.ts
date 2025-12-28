import { Response } from 'express';
import { PlanService } from '../services/plan.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class MealController {
    private planService: PlanService;

    constructor() {
        this.planService = new PlanService();
    }

    /**
     * Mark meal as consumed
     * PUT /api/meals/:planId/consume
     */
    consumeMeal = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const planId = parseInt(req.params.planId);
            const { mealType } = req.body;

            const updatedPlan = await this.planService.consumeMeal(planId, mealType);

            res.status(200).json({
                success: true,
                message: 'Meal marked as consumed',
                data: updatedPlan
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to consume meal'
            });
        }
    };

    /**
     * Adjust meal calories
     * PUT /api/meals/:planId/adjust
     */
    adjustMeal = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const planId = parseInt(req.params.planId);
            const { mealType, adjustedCalories } = req.body;

            const updatedPlan = await this.planService.adjustMeal(
                planId,
                mealType,
                adjustedCalories
            );

            res.status(200).json({
                success: true,
                message: 'Meal adjusted successfully',
                data: updatedPlan
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to adjust meal'
            });
        }
    };
}
