import { Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateUserDTO, UpdateUserDTO } from '../types';
import { generateToken } from '../middleware/auth.middleware';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Create a new user
     * POST /api/users
     */
    createUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userData: CreateUserDTO = req.body;
            const user = await this.userService.createUser(userData);

            // Generate JWT token
            const token = generateToken(user.id, user.role);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user,
                    token
                }
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to create user'
            });
        }
    };

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.id);
            const user = await this.userService.getUserById(userId);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch user'
            });
        }
    };

    /**
     * Update user profile
     * PUT /api/users/:id
     */
    updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.id);
            const updateData: UpdateUserDTO = req.body;

            const user = await this.userService.updateUser(userId, updateData);

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to update user'
            });
        }
    };

    /**
     * Get all users (Admin only)
     * GET /api/users
     */
    getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();

            res.status(200).json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch users'
            });
        }
    };

    /**
     * Delete user (Admin only)
     * DELETE /api/users/:id
     */
    deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = parseInt(req.params.id);
            await this.userService.deleteUser(userId);

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to delete user'
            });
        }
    };
}
