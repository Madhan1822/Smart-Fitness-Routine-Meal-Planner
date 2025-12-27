import { User, WorkoutMealPlan } from '../types';

/**
 * In-Memory Database for Demo Mode
 * This allows the backend to run without MySQL
 */
class InMemoryDatabase {
    private users: Map<number, User> = new Map();
    private plans: Map<number, WorkoutMealPlan> = new Map();
    private userIdCounter = 1;
    private planIdCounter = 1;

    // User operations
    async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
        const user: User = {
            id: this.userIdCounter++,
            ...userData,
            created_at: new Date()
        };
        this.users.set(user.id, user);
        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
        const user = this.users.get(id);
        if (!user) return null;

        const updatedUser = { ...user, ...updates };
        this.users.set(id, updatedUser);
        return updatedUser;
    }

    async getAllUsers(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    async deleteUser(id: number): Promise<boolean> {
        // Also delete user's plans
        const userPlans = Array.from(this.plans.values()).filter(p => p.user_id === id);
        userPlans.forEach(plan => this.plans.delete(plan.id));

        return this.users.delete(id);
    }

    // Plan operations
    async createPlan(planData: Omit<WorkoutMealPlan, 'id'>): Promise<WorkoutMealPlan> {
        const plan: WorkoutMealPlan = {
            id: this.planIdCounter++,
            ...planData
        };
        this.plans.set(plan.id, plan);
        return plan;
    }

    async getPlanById(id: number): Promise<WorkoutMealPlan | null> {
        return this.plans.get(id) || null;
    }

    async getPlansByUserId(userId: number): Promise<WorkoutMealPlan[]> {
        return Array.from(this.plans.values())
            .filter(plan => plan.user_id === userId)
            .sort((a, b) => {
                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
            });
    }

    async updatePlan(id: number, updates: Partial<WorkoutMealPlan>): Promise<WorkoutMealPlan | null> {
        const plan = this.plans.get(id);
        if (!plan) return null;

        const updatedPlan = { ...plan, ...updates };
        this.plans.set(id, updatedPlan);
        return updatedPlan;
    }

    async deletePlansByUserId(userId: number): Promise<void> {
        const userPlans = Array.from(this.plans.values()).filter(p => p.user_id === userId);
        userPlans.forEach(plan => this.plans.delete(plan.id));
    }

    // Utility
    async clear(): Promise<void> {
        this.users.clear();
        this.plans.clear();
        this.userIdCounter = 1;
        this.planIdCounter = 1;
    }

    getStats() {
        return {
            users: this.users.size,
            plans: this.plans.size
        };
    }
}

// Export singleton instance
export const inMemoryDb = new InMemoryDatabase();
