// User-related types
export enum UserGoal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    MAINTENANCE = 'maintenance'
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export interface User {
    id: number;
    name: string;
    age: number;
    gender: Gender;
    height: number;
    weight: number;
    goal: UserGoal;
    role: UserRole;
    created_at: Date;
}

export interface CreateUserDTO {
    name: string;
    age: number;
    gender: Gender;
    height: number;
    weight: number;
    goal: UserGoal;
    role?: UserRole;
}

export interface UpdateUserDTO {
    name?: string;
    age?: number;
    gender?: Gender;
    height?: number;
    weight?: number;
    goal?: UserGoal;
}

// Workout and Meal types
export interface Exercise {
    name: string;
    sets?: number;
    reps?: number;
    duration?: number; // in minutes
    caloriesBurned: number;
    completed: boolean;
}

export interface Meal {
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    items: string[];
    consumed: boolean;
}

export interface CompletedStatus {
    exercises: {
        [exerciseName: string]: boolean;
    };
    meals: {
        [mealType: string]: boolean;
    };
}

export interface WorkoutMealPlan {
    id: number;
    user_id: number;
    day: string;
    exercises: Exercise[];
    meals: Meal[];
    completed_status: CompletedStatus;
}

export interface CreatePlanDTO {
    user_id: number;
    day: string;
    exercises: Exercise[];
    meals: Meal[];
}

// Progress tracking types
export interface ProgressSummary {
    userId: number;
    totalWorkoutsCompleted: number;
    totalWorkouts: number;
    caloriesConsumed: number;
    caloriesTarget: number;
    weeklyWorkoutCompletion: number; // percentage
    weeklyMealCompletion: number; // percentage
    weeklySummary: DailySummary[];
}

export interface DailySummary {
    day: string;
    workoutsCompleted: number;
    totalWorkouts: number;
    caloriesConsumed: number;
    caloriesTarget: number;
}

// Auth types
export interface AuthPayload {
    userId: number;
    role: UserRole;
}

export interface AuthRequest extends Request {
    user?: AuthPayload;
}
