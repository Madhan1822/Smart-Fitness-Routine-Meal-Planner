import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthPayload, UserRole } from '../types';

// Extend Express Request type
export interface AuthRequest extends Request {
    user?: AuthPayload;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Authorization header required.'
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
        return;
    }
};

/**
 * Authorization middleware for ADMIN role
 */
export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    if (req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }

    next();
};

/**
 * Authorization middleware to ensure user can only access their own data
 */
export const requireOwnership = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    const requestedUserId = parseInt(req.params.id || req.params.userId);

    // Admin can access any user's data
    if (req.user.role === UserRole.ADMIN) {
        next();
        return;
    }

    // Regular users can only access their own data
    if (req.user.userId !== requestedUserId) {
        res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own data.'
        });
        return;
    }

    next();
};

/**
 * Generate JWT token for user
 */
export const generateToken = (userId: number, role: UserRole): string => {
    const payload: AuthPayload = {
        userId,
        role
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    } as jwt.SignOptions);
};
