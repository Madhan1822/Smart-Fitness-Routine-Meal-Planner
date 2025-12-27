import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
    const app = express();

    // Middleware
    app.use(cors({
        origin: config.cors.origin,
        credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });

    // API routes
    app.use('/api', routes);

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Smart Fitness Routine & Meal Planner API',
            version: '1.0.0',
            endpoints: {
                health: '/api/health',
                users: '/api/users',
                plans: '/api/plans',
                meals: '/api/meals',
                progress: '/api/progress'
            }
        });
    });

    // Error handlers (must be last)
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
