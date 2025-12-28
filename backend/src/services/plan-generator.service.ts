import { UserGoal, Gender, Exercise, Meal } from '../types';

/**
 * Plan Generator Service
 * Contains rule-based logic for generating workout and meal plans
 */
export class PlanGeneratorService {
    private readonly DAYS_OF_WEEK = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    /**
     * Generate weekly workout and meal plans based on user goal
     */
    generateWeeklyPlans(
        goal: UserGoal,
        gender: Gender,
        weight: number
    ): { day: string; exercises: Exercise[]; meals: Meal[] }[] {
        const weeklyPlans = this.DAYS_OF_WEEK.map((day) => ({
            day,
            exercises: this.generateDailyWorkout(goal, day),
            meals: this.generateDailyMeals(goal, gender, weight)
        }));

        return weeklyPlans;
    }

    /**
     * Generate daily workout based on goal and day
     */
    private generateDailyWorkout(goal: UserGoal, day: string): Exercise[] {
        switch (goal) {
            case UserGoal.WEIGHT_LOSS:
                return this.getWeightLossWorkout(day);

            case UserGoal.MUSCLE_GAIN:
                return this.getMuscleGainWorkout(day);

            case UserGoal.MAINTENANCE:
                return this.getMaintenanceWorkout(day);

            default:
                return [];
        }
    }

    /**
     * Weight Loss Workout Plan - Focus on cardio and HIIT
     */
    private getWeightLossWorkout(day: string): Exercise[] {
        const workoutMap: { [key: string]: Exercise[] } = {
            Monday: [
                { name: 'Running', duration: 30, caloriesBurned: 300, completed: false },
                { name: 'Jump Rope', duration: 15, caloriesBurned: 150, completed: false }
            ],
            Tuesday: [
                { name: 'HIIT Training', duration: 25, caloriesBurned: 350, completed: false },
                { name: 'Burpees', sets: 3, reps: 15, caloriesBurned: 100, completed: false }
            ],
            Wednesday: [
                { name: 'Cycling', duration: 40, caloriesBurned: 320, completed: false },
                { name: 'Mountain Climbers', sets: 3, reps: 20, caloriesBurned: 80, completed: false }
            ],
            Thursday: [
                { name: 'Swimming', duration: 30, caloriesBurned: 280, completed: false },
                { name: 'Jumping Jacks', sets: 3, reps: 30, caloriesBurned: 90, completed: false }
            ],
            Friday: [
                { name: 'Jogging', duration: 35, caloriesBurned: 290, completed: false },
                { name: 'High Knees', duration: 10, caloriesBurned: 100, completed: false }
            ],
            Saturday: [
                { name: 'Zumba/Dance', duration: 45, caloriesBurned: 350, completed: false }
            ],
            Sunday: [
                { name: 'Light Walking', duration: 30, caloriesBurned: 120, completed: false },
                { name: 'Stretching', duration: 15, caloriesBurned: 50, completed: false }
            ]
        };

        return workoutMap[day] || [];
    }

    /**
     * Muscle Gain Workout Plan - Focus on strength training
     */
    private getMuscleGainWorkout(day: string): Exercise[] {
        const workoutMap: { [key: string]: Exercise[] } = {
            Monday: [
                { name: 'Bench Press', sets: 4, reps: 10, caloriesBurned: 150, completed: false },
                { name: 'Tricep Dips', sets: 3, reps: 12, caloriesBurned: 100, completed: false },
                { name: 'Push-ups', sets: 3, reps: 15, caloriesBurned: 80, completed: false }
            ],
            Tuesday: [
                { name: 'Deadlifts', sets: 4, reps: 8, caloriesBurned: 180, completed: false },
                { name: 'Pull-ups', sets: 3, reps: 10, caloriesBurned: 120, completed: false },
                { name: 'Bicep Curls', sets: 3, reps: 12, caloriesBurned: 90, completed: false }
            ],
            Wednesday: [
                { name: 'Squats', sets: 4, reps: 12, caloriesBurned: 160, completed: false },
                { name: 'Lunges', sets: 3, reps: 15, caloriesBurned: 110, completed: false },
                { name: 'Calf Raises', sets: 3, reps: 20, caloriesBurned: 70, completed: false }
            ],
            Thursday: [
                { name: 'Shoulder Press', sets: 4, reps: 10, caloriesBurned: 140, completed: false },
                { name: 'Lateral Raises', sets: 3, reps: 12, caloriesBurned: 90, completed: false },
                { name: 'Front Raises', sets: 3, reps: 12, caloriesBurned: 85, completed: false }
            ],
            Friday: [
                { name: 'Barbell Rows', sets: 4, reps: 10, caloriesBurned: 150, completed: false },
                { name: 'Lat Pulldown', sets: 3, reps: 12, caloriesBurned: 110, completed: false },
                { name: 'Face Pulls', sets: 3, reps: 15, caloriesBurned: 80, completed: false }
            ],
            Saturday: [
                { name: 'Core Training', duration: 30, caloriesBurned: 150, completed: false },
                { name: 'Planks', duration: 5, caloriesBurned: 50, completed: false }
            ],
            Sunday: [
                { name: 'Active Recovery', duration: 20, caloriesBurned: 80, completed: false },
                { name: 'Yoga', duration: 30, caloriesBurned: 100, completed: false }
            ]
        };

        return workoutMap[day] || [];
    }

    /**
     * Maintenance Workout Plan - Balanced approach
     */
    private getMaintenanceWorkout(day: string): Exercise[] {
        const workoutMap: { [key: string]: Exercise[] } = {
            Monday: [
                { name: 'Full Body Workout', duration: 40, caloriesBurned: 250, completed: false },
                { name: 'Push-ups', sets: 3, reps: 15, caloriesBurned: 80, completed: false }
            ],
            Tuesday: [
                { name: 'Jogging', duration: 25, caloriesBurned: 200, completed: false },
                { name: 'Squats', sets: 3, reps: 15, caloriesBurned: 100, completed: false }
            ],
            Wednesday: [
                { name: 'Cardio + Core', duration: 35, caloriesBurned: 230, completed: false },
                { name: 'Planks', duration: 3, caloriesBurned: 40, completed: false }
            ],
            Thursday: [
                { name: 'Strength Training', duration: 30, caloriesBurned: 200, completed: false },
                { name: 'Lunges', sets: 3, reps: 12, caloriesBurned: 90, completed: false }
            ],
            Friday: [
                { name: 'Cycling', duration: 30, caloriesBurned: 220, completed: false },
                { name: 'Crunches', sets: 3, reps: 20, caloriesBurned: 60, completed: false }
            ],
            Saturday: [
                { name: 'Sports/Recreation', duration: 45, caloriesBurned: 280, completed: false }
            ],
            Sunday: [
                { name: 'Rest Day - Light Stretching', duration: 20, caloriesBurned: 60, completed: false }
            ]
        };

        return workoutMap[day] || [];
    }

    /**
     * Generate daily meals based on goal
     */
    private generateDailyMeals(goal: UserGoal, gender: Gender, weight: number): Meal[] {
        switch (goal) {
            case UserGoal.WEIGHT_LOSS:
                return this.getWeightLossMeals();

            case UserGoal.MUSCLE_GAIN:
                return this.getMuscleGainMeals(gender);

            case UserGoal.MAINTENANCE:
                return this.getMaintenanceMeals();

            default:
                return [];
        }
    }

    /**
     * Weight Loss Meal Plan - Calorie deficit
     */
    private getWeightLossMeals(): Meal[] {
        return [
            {
                name: 'Healthy Breakfast',
                type: 'breakfast',
                calories: 300,
                protein: 15,
                carbs: 40,
                fats: 8,
                items: ['Oatmeal', 'Banana', 'Almonds', 'Green Tea'],
                consumed: false
            },
            {
                name: 'Light Lunch',
                type: 'lunch',
                calories: 400,
                protein: 25,
                carbs: 45,
                fats: 10,
                items: ['Grilled Chicken', 'Brown Rice', 'Steamed Vegetables', 'Salad'],
                consumed: false
            },
            {
                name: 'Healthy Snack',
                type: 'snack',
                calories: 150,
                protein: 8,
                carbs: 20,
                fats: 5,
                items: ['Greek Yogurt', 'Berries', 'Handful of Nuts'],
                consumed: false
            },
            {
                name: 'Light Dinner',
                type: 'dinner',
                calories: 350,
                protein: 30,
                carbs: 30,
                fats: 12,
                items: ['Grilled Fish', 'Quinoa', 'Roasted Vegetables', 'Lemon Water'],
                consumed: false
            }
        ];
    }

    /**
     * Muscle Gain Meal Plan - Calorie surplus
     */
    private getMuscleGainMeals(gender: Gender): Meal[] {
        const proteinMultiplier = gender === Gender.MALE ? 1.2 : 1.0;

        return [
            {
                name: 'High Protein Breakfast',
                type: 'breakfast',
                calories: 550,
                protein: Math.round(35 * proteinMultiplier),
                carbs: 60,
                fats: 18,
                items: ['Eggs', 'Whole Wheat Toast', 'Avocado', 'Protein Shake', 'Oatmeal'],
                consumed: false
            },
            {
                name: 'Power Lunch',
                type: 'lunch',
                calories: 700,
                protein: Math.round(45 * proteinMultiplier),
                carbs: 75,
                fats: 22,
                items: ['Chicken Breast', 'Sweet Potato', 'Brown Rice', 'Vegetables', 'Olive Oil'],
                consumed: false
            },
            {
                name: 'Pre-Workout Snack',
                type: 'snack',
                calories: 350,
                protein: Math.round(20 * proteinMultiplier),
                carbs: 45,
                fats: 10,
                items: ['Banana', 'Peanut Butter', 'Protein Bar', 'Milk'],
                consumed: false
            },
            {
                name: 'High Calorie Dinner',
                type: 'dinner',
                calories: 650,
                protein: Math.round(40 * proteinMultiplier),
                carbs: 70,
                fats: 20,
                items: ['Lean Beef', 'Pasta', 'Cheese', 'Vegetables', 'Nuts'],
                consumed: false
            }
        ];
    }

    /**
     * Maintenance Meal Plan - Balanced calories
     */
    private getMaintenanceMeals(): Meal[] {
        return [
            {
                name: 'Balanced Breakfast',
                type: 'breakfast',
                calories: 400,
                protein: 20,
                carbs: 50,
                fats: 12,
                items: ['Scrambled Eggs', 'Whole Grain Toast', 'Fruit', 'Coffee'],
                consumed: false
            },
            {
                name: 'Balanced Lunch',
                type: 'lunch',
                calories: 550,
                protein: 30,
                carbs: 60,
                fats: 18,
                items: ['Grilled Chicken', 'Rice', 'Mixed Vegetables', 'Salad', 'Yogurt'],
                consumed: false
            },
            {
                name: 'Afternoon Snack',
                type: 'snack',
                calories: 250,
                protein: 12,
                carbs: 30,
                fats: 8,
                items: ['Apple', 'Cheese', 'Crackers', 'Green Tea'],
                consumed: false
            },
            {
                name: 'Balanced Dinner',
                type: 'dinner',
                calories: 500,
                protein: 35,
                carbs: 50,
                fats: 15,
                items: ['Salmon', 'Quinoa', 'Steamed Broccoli', 'Side Salad'],
                consumed: false
            }
        ];
    }

    /**
     * Calculate total daily calories for a meal plan
     */
    calculateTotalCalories(meals: Meal[]): number {
        return meals.reduce((total, meal) => total + meal.calories, 0);
    }

    /**
     * Calculate total daily macros
     */
    calculateTotalMacros(meals: Meal[]): { protein: number; carbs: number; fats: number } {
        return meals.reduce(
            (totals, meal) => ({
                protein: totals.protein + meal.protein,
                carbs: totals.carbs + meal.carbs,
                fats: totals.fats + meal.fats
            }),
            { protein: 0, carbs: 0, fats: 0 }
        );
    }
}
