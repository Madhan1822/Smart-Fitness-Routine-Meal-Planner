export interface MealPlan {
  meal: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  items: string[];

  calories: number;
  protein: number;
  carbs: number;
  fats: number;

  eaten: boolean;
  expanded?: boolean;
}