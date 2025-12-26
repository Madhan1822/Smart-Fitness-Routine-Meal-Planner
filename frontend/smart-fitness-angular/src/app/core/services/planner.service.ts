// src/app/core/services/planner.service.ts

import { Injectable } from '@angular/core';
import { MealPlan } from '../../shared/models/meal.model';
import { DailyWorkoutPlan } from '../../shared/models/daily-workout-plan.model';

@Injectable({ providedIn: 'root' })
export class PlannerService {

  /* ================= CALORIES ================= */

  calculateDailyCalories(
    gender: 'Male' | 'Female',
    goal: 'Weight Loss' | 'Maintain Fitness' | 'Weight Gain',
    weight: number
  ): number {
    const base = gender === 'Male' ? 2400 : 2000;

    if (goal === 'Weight Loss') return base - 400;
    if (goal === 'Weight Gain') return base + 300;

    return base;
  }

  /* ================= MEAL PLAN ================= */

  generateMealPlan(goal: 'loss' | 'gain' | 'fit'): MealPlan[] {
    const meals: MealPlan[] =
      goal === 'loss'
        ? [
            { meal: 'Breakfast', items: ['Oats', 'Fruit'], calories: 300, protein: 12, carbs: 45, fats: 6, eaten: false },
            { meal: 'Lunch', items: ['Brown Rice', 'Dal', 'Veg'], calories: 450, protein: 18, carbs: 65, fats: 8, eaten: false },
            { meal: 'Snack', items: ['Apple', 'Nuts'], calories: 200, protein: 6, carbs: 20, fats: 10, eaten: false },
            { meal: 'Dinner', items: ['Chapati', 'Veg Curry'], calories: 400, protein: 14, carbs: 55, fats: 9, eaten: false }
          ]
        : goal === 'gain'
        ? [
            { meal: 'Breakfast', items: ['Oats', 'Milk', 'Peanut Butter'], calories: 500, protein: 20, carbs: 55, fats: 15, eaten: false },
            { meal: 'Lunch', items: ['Rice', 'Paneer', 'Veg'], calories: 650, protein: 25, carbs: 70, fats: 18, eaten: false },
            { meal: 'Snack', items: ['Banana Shake'], calories: 350, protein: 15, carbs: 40, fats: 10, eaten: false },
            { meal: 'Dinner', items: ['Chapati', 'Chicken Curry'], calories: 600, protein: 30, carbs: 50, fats: 20, eaten: false }
          ]
        : [
            { meal: 'Breakfast', items: ['Oats', 'Banana'], calories: 400, protein: 15, carbs: 50, fats: 8, eaten: false },
            { meal: 'Lunch', items: ['Rice', 'Dal'], calories: 550, protein: 20, carbs: 70, fats: 10, eaten: false },
            { meal: 'Snack', items: ['Yogurt', 'Fruits'], calories: 250, protein: 8, carbs: 30, fats: 5, eaten: false },
            { meal: 'Dinner', items: ['Chapati', 'Veg Curry'], calories: 450, protein: 15, carbs: 55, fats: 9, eaten: false }
          ];

    return meals.map(m => ({ ...m, expanded: false }));
  }

  /* ================= WORKOUT PLAN ================= */

  generateWorkoutPlan(
    goal: 'Weight Loss' | 'Maintain Fitness' | 'Weight Gain'
  ): DailyWorkoutPlan[] {
    if (goal === 'Weight Loss') return this.weightLossPlan();
    if (goal === 'Weight Gain') return this.weightGainPlan();
    return this.maintainPlan();
  }

  private weightLossPlan(): DailyWorkoutPlan[] {
  return [
    {
      day: 'Monday',
      expanded: false,
      workouts: [
        { name: 'Cardio', durationMin: 40, caloriesBurned: 300, completed: false }
      ]
    },
    {
      day: 'Tuesday',
      expanded: false,
      workouts: [
        { name: 'HIIT', durationMin: 30, caloriesBurned: 350, completed: false }
      ]
    },
    {
      day: 'Wednesday',
      expanded: false,
      workouts: [
        { name: 'Strength', durationMin: 40, caloriesBurned: 250, completed: false }
      ]
    }
  ];
}

private weightGainPlan(): DailyWorkoutPlan[] {
  return [
    {
      day: 'Monday',
      expanded: false,
      workouts: [
        { name: 'Chest & Triceps', durationMin: 50, caloriesBurned: 200, completed: false }
      ]
    },
    {
      day: 'Tuesday',
      expanded: false,
      workouts: [
        { name: 'Back & Biceps', durationMin: 50, caloriesBurned: 220, completed: false }
      ]
    }
  ];
}

private maintainPlan(): DailyWorkoutPlan[] {
  return [
    {
      day: 'Monday',
      expanded: false,
      workouts: [
        { name: 'Full Body', durationMin: 45, caloriesBurned: 250, completed: false }
      ]
    },
    {
      day: 'Wednesday',
      expanded: false,
      workouts: [
        { name: 'Cardio + Core', durationMin: 40, caloriesBurned: 230, completed: false }
      ]
    }
  ];
}
getWorkoutLevel(
  goal: 'loss' | 'fit' | 'gain',
  weight: number
): 'Beginner' | 'Intermediate' | 'Advanced' {

  if (goal === 'loss') return 'Beginner';

  if (goal === 'fit') {
    if (weight < 70) return 'Beginner';
    if (weight < 85) return 'Intermediate';
    return 'Advanced';
  }

  // gain
  if (weight < 65) return 'Beginner';
  if (weight < 80) return 'Intermediate';
  return 'Advanced';
}
}