import { inMemoryDb } from '../database/in-memory-db';
import { User, CreateUserDTO, UpdateUserDTO, UserRole } from '../types';
import { AppError } from '../middleware/error.middleware';

export class UserService {
    /**
     * Create a new user
     */
    async createUser(userData: CreateUserDTO): Promise<User> {
        const { name, age, gender, height, weight, goal, role = UserRole.USER } = userData;

        const user = await inMemoryDb.createUser({
            name,
            age,
            gender,
            height,
            weight,
            goal,
            role
        });

        return user;
    }

    /**
     * Get user by ID
     */
    async getUserById(id: number): Promise<User | null> {
        return await inMemoryDb.getUserById(id);
    }

    /**
     * Update user profile
     */
    async updateUser(id: number, userData: UpdateUserDTO): Promise<User> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const updatedUser = await inMemoryDb.updateUser(id, userData);

        if (!updatedUser) {
            throw new AppError('Failed to update user', 500);
        }

        return updatedUser;
    }

    /**
     * Get all users (Admin only)
     */
    async getAllUsers(): Promise<User[]> {
        return await inMemoryDb.getAllUsers();
    }

    /**
     * Delete user (Admin only)
     */
    async deleteUser(id: number): Promise<void> {
        const user = await this.getUserById(id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        await inMemoryDb.deleteUser(id);
    }

    /**
     * Check if user exists
     */
    async userExists(id: number): Promise<boolean> {
        const user = await this.getUserById(id);
        return user !== null;
    }
}
