import { inMemoryDb } from '../database/in-memory-db';
import { WorkoutMealPlan, Exercise, Meal, CompletedStatus } from '../types';
import { AppError } from '../middleware/error.middleware';
import { PlanGeneratorService } from './plan-generator.service';
import { UserService } from './user.service';

export class PlanService {
    private planGenerator: PlanGeneratorService;
    private userService: UserService;

    constructor() {
        this.planGenerator = new PlanGeneratorService();
        this.userService = new UserService();
    }

    /**
     * Generate weekly workout and meal plans for a user
     */
    async generatePlansForUser(userId: number): Promise<WorkoutMealPlan[]> {
        // Get user details
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Delete existing plans for this user
        await inMemoryDb.deletePlansByUserId(userId);

        // Generate new plans
        const weeklyPlans = this.planGenerator.generateWeeklyPlans(
            user.goal,
            user.gender,
            user.weight
        );

        // Insert plans into database
        const createdPlans: WorkoutMealPlan[] = [];

        for (const plan of weeklyPlans) {
            const completedStatus: CompletedStatus = {
                exercises: {},
                meals: {}
            };

            // Initialize completion status
            plan.exercises.forEach((exercise) => {
                completedStatus.exercises[exercise.name] = false;
            });

            plan.meals.forEach((meal) => {
                completedStatus.meals[meal.type] = false;
            });

            const createdPlan = await inMemoryDb.createPlan({
                user_id: userId,
                day: plan.day,
                exercises: plan.exercises,
                meals: plan.meals,
                completed_status: completedStatus
            });

            createdPlans.push(createdPlan);
        }

        return createdPlans;
    }

    /**
     * Get plan by ID
     */
    async getPlanById(id: number): Promise<WorkoutMealPlan | null> {
        return await inMemoryDb.getPlanById(id);
    }

    /**
     * Get all plans for a user
     */
    async getPlansByUserId(userId: number): Promise<WorkoutMealPlan[]> {
        return await inMemoryDb.getPlansByUserId(userId);
    }

    /**
     * Mark exercise as completed
     */
    async completeExercise(planId: number, exerciseName: string): Promise<WorkoutMealPlan> {
        const plan = await this.getPlanById(planId);

        if (!plan) {
            throw new AppError('Plan not found', 404);
        }

        // Find the exercise
        const exercise = plan.exercises.find((ex) => ex.name === exerciseName);

        if (!exercise) {
            throw new AppError('Exercise not found in this plan', 404);
        }

        // Update exercise completion status
        exercise.completed = true;
        plan.completed_status.exercises[exerciseName] = true;

        // Update in database
        const updatedPlan = await inMemoryDb.updatePlan(planId, {
            exercises: plan.exercises,
            completed_status: plan.completed_status
        });

        if (!updatedPlan) {
            throw new AppError('Failed to update plan', 500);
        }

        return updatedPlan;
    }

    /**
     * Mark meal as consumed
     */
    async consumeMeal(planId: number, mealType: string): Promise<WorkoutMealPlan> {
        const plan = await this.getPlanById(planId);

        if (!plan) {
            throw new AppError('Plan not found', 404);
        }

        // Find the meal
        const meal = plan.meals.find((m) => m.type === mealType);

        if (!meal) {
            throw new AppError('Meal not found in this plan', 404);
        }

        // Update meal consumption status
        meal.consumed = true;
        plan.completed_status.meals[mealType] = true;

        // Update in database
        const updatedPlan = await inMemoryDb.updatePlan(planId, {
            meals: plan.meals,
            completed_status: plan.completed_status
        });

        if (!updatedPlan) {
            throw new AppError('Failed to update plan', 500);
        }

        return updatedPlan;
    }

    /**
     * Adjust meal calories
     */
    async adjustMeal(
        planId: number,
        mealType: string,
        adjustedCalories: number
    ): Promise<WorkoutMealPlan> {
        const plan = await this.getPlanById(planId);

        if (!plan) {
            throw new AppError('Plan not found', 404);
        }

        // Find the meal
        const meal = plan.meals.find((m) => m.type === mealType);

        if (!meal) {
            throw new AppError('Meal not found in this plan', 404);
        }

        // Calculate adjustment ratio
        const ratio = adjustedCalories / meal.calories;

        // Adjust all macros proportionally
        meal.calories = adjustedCalories;
        meal.protein = Math.round(meal.protein * ratio);
        meal.carbs = Math.round(meal.carbs * ratio);
        meal.fats = Math.round(meal.fats * ratio);

        // Update in database
        const updatedPlan = await inMemoryDb.updatePlan(planId, {
            meals: plan.meals
        });

        if (!updatedPlan) {
            throw new AppError('Failed to update plan', 500);
        }

        return updatedPlan;
    }

    /**
     * Delete all plans for a user
     */
    async deletePlansByUserId(userId: number): Promise<void> {
        await inMemoryDb.deletePlansByUserId(userId);
    }
}
