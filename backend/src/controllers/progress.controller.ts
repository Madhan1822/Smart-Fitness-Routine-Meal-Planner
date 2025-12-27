import { Response } from 'express';
import { ProgressService } from '../services/progress.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProgressController {
    private progressService: ProgressService;

    constructor() {
        this.progressService = new ProgressService();
    }

    /**
     * Get progress summary for a user
     * GET /api/progress/:userId
     */
    getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.userId);
            const progress = await this.progressService.calculateProgress(userId);

            res.status(200).json({
                success: true,
                data: progress
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch progress'
            });
        }
    };

    /**
     * Get daily summary
     * GET /api/progress/:userId/day/:day
     */
    getDailySummary = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.userId);
            const day = req.params.day;

            const summary = await this.progressService.getDailySummary(userId, day);

            if (!summary) {
                res.status(404).json({
                    success: false,
                    message: 'No data found for this day'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: summary
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch daily summary'
            });
        }
    };

    /**
     * Get total calories burned
     * GET /api/progress/:userId/calories-burned
     */
    getCaloriesBurned = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.userId);
            const caloriesBurned = await this.progressService.getTotalCaloriesBurned(userId);

            res.status(200).json({
                success: true,
                data: {
                    userId,
                    totalCaloriesBurned: caloriesBurned
                }
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch calories burned'
            });
        }
    };
}
