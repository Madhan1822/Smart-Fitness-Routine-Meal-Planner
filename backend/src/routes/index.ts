import { Router } from 'express';
import userRoutes from './user.routes';
import planRoutes from './plan.routes';
import mealRoutes from './meal.routes';
import progressRoutes from './progress.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Fitness API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/meals', mealRoutes);
router.use('/progress', progressRoutes);

export default router;
