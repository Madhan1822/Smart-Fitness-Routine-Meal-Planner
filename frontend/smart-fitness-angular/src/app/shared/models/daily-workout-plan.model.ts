export interface DailyWorkoutPlan {
  day: string;
  expanded: boolean;   // 🔒 NOT optional

  workouts: {
    name: string;
    durationMin: number;
    caloriesBurned: number;
    completed: boolean; // 🔒 NOT optional
  }[];
}