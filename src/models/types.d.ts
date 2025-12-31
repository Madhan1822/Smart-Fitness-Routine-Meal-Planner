export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    height: number;
    weight: number;
    goal: 'weight loss' | 'muscle gain' | 'maintenance';
    created_at?: Date;
}
export interface WorkoutMealPlan {
    id?: number;
    user_id: number;
    day: string;
    exercises: any;
    meals: any;
    completed_status: any;
}
//# sourceMappingURL=types.d.ts.map