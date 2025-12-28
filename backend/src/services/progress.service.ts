import { PlanService } from './plan.service';
import { ProgressSummary, DailySummary } from '../types';
import { AppError } from '../middleware/error.middleware';

export class ProgressService {
    private planService: PlanService;

    constructor() {
        this.planService = new PlanService();
    }

    /**
     * Calculate progress for a user
     * Derived from WorkoutMealPlans data
     */
    async calculateProgress(userId: number): Promise<ProgressSummary> {
        const plans = await this.planService.getPlansByUserId(userId);

        if (plans.length === 0) {
            throw new AppError('No plans found for this user. Please generate plans first.', 404);
        }

        let totalWorkouts = 0;
        let totalWorkoutsCompleted = 0;
        let totalCaloriesConsumed = 0;
        let totalCaloriesTarget = 0;

        const weeklySummary: DailySummary[] = [];

        // Calculate metrics for each day
        for (const plan of plans) {
            const dayWorkouts = plan.exercises.length;
            const dayWorkoutsCompleted = plan.exercises.filter((ex) => ex.completed).length;

            const dayCaloriesTarget = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
            const dayCaloriesConsumed = plan.meals
                .filter((meal) => meal.consumed)
                .reduce((sum, meal) => sum + meal.calories, 0);

            totalWorkouts += dayWorkouts;
            totalWorkoutsCompleted += dayWorkoutsCompleted;
            totalCaloriesTarget += dayCaloriesTarget;
            totalCaloriesConsumed += dayCaloriesConsumed;

            weeklySummary.push({
                day: plan.day,
                workoutsCompleted: dayWorkoutsCompleted,
                totalWorkouts: dayWorkouts,
                caloriesConsumed: dayCaloriesConsumed,
                caloriesTarget: dayCaloriesTarget
            });
        }

        const weeklyWorkoutCompletion = totalWorkouts > 0
            ? Math.round((totalWorkoutsCompleted / totalWorkouts) * 100)
            : 0;

        const weeklyMealCompletion = totalCaloriesTarget > 0
            ? Math.round((totalCaloriesConsumed / totalCaloriesTarget) * 100)
            : 0;

        return {
            userId,
            totalWorkoutsCompleted,
            totalWorkouts,
            caloriesConsumed: totalCaloriesConsumed,
            caloriesTarget: totalCaloriesTarget,
            weeklyWorkoutCompletion,
            weeklyMealCompletion,
            weeklySummary
        };
    }

    /**
     * Get daily summary for a specific day
     */
    async getDailySummary(userId: number, day: string): Promise<DailySummary | null> {
        const plans = await this.planService.getPlansByUserId(userId);
        const dayPlan = plans.find((p) => p.day.toLowerCase() === day.toLowerCase());

        if (!dayPlan) {
            return null;
        }

        const workoutsCompleted = dayPlan.exercises.filter((ex) => ex.completed).length;
        const totalWorkouts = dayPlan.exercises.length;

        const caloriesTarget = dayPlan.meals.reduce((sum, meal) => sum + meal.calories, 0);
        const caloriesConsumed = dayPlan.meals
            .filter((meal) => meal.consumed)
            .reduce((sum, meal) => sum + meal.calories, 0);

        return {
            day: dayPlan.day,
            workoutsCompleted,
            totalWorkouts,
            caloriesConsumed,
            caloriesTarget
        };
    }

    /**
     * Calculate workout completion percentage
     */
    async getWorkoutCompletionRate(userId: number): Promise<number> {
        const progress = await this.calculateProgress(userId);
        return progress.weeklyWorkoutCompletion;
    }

    /**
     * Calculate meal adherence percentage
     */
    async getMealAdherenceRate(userId: number): Promise<number> {
        const progress = await this.calculateProgress(userId);
        return progress.weeklyMealCompletion;
    }

    /**
     * Get total calories burned from completed workouts
     */
    async getTotalCaloriesBurned(userId: number): Promise<number> {
        const plans = await this.planService.getPlansByUserId(userId);

        let totalBurned = 0;

        for (const plan of plans) {
            const completedExercises = plan.exercises.filter((ex) => ex.completed);
            totalBurned += completedExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
        }

        return totalBurned;
    }
}
