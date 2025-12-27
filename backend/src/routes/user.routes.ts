import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, requireAdmin, requireOwnership } from '../middleware/auth.middleware';
import {
    validateCreateUser,
    validateUpdateUser,
    validateUserId
} from '../middleware/validation.middleware';

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', validateCreateUser, userController.createUser);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin only
 */
router.get('/', authenticate, requireAdmin, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (own data) or Admin
 */
router.get('/:id', authenticate, requireOwnership, validateUserId, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private (own data) or Admin
 */
router.put('/:id', authenticate, requireOwnership, validateUpdateUser, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete('/:id', authenticate, requireAdmin, validateUserId, userController.deleteUser);

export default router;
