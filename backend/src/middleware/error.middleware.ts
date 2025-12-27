import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;

    // Check if it's our custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }

    // Log error details for debugging
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.path,
        method: req.method
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};
