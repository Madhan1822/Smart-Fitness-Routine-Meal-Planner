import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { PlannerService } from '../../core/services/planner.service';
import { ProgramStateService } from '../../core/services/program-state.service';
import { WeightService } from '../../core/services/weight.service';

import { MealPlan } from '../../shared/models/meal.model';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss']
})
export class MealComponent implements OnInit {

  dailyCalorieGoal = 0;
  meals: MealPlan[] = [];

  constructor(
    private plannerService: PlannerService,
    private programState: ProgramStateService,
    private weightService: WeightService
  ) {}

  ngOnInit(): void {
    const weight = this.weightService.getLatestWeight();
    const goal = this.programState.goal;
    const gender = this.programState.gender;

    // 🔒 SAFETY CHECK (THIS FIXES YOUR ERRORS)
    if (!weight || !goal || !gender) return;

    // Calories
    this.dailyCalorieGoal =
      this.plannerService.calculateDailyCalories(
        gender === 'male' ? 'Male' : 'Female',
        goal === 'loss'
          ? 'Weight Loss'
          : goal === 'gain'
          ? 'Weight Gain'
          : 'Maintain Fitness',
        weight
      );

    // Meals
    this.meals = this.plannerService.generateMealPlan(goal);
  }

  /* ---------------- UI ACTIONS ---------------- */
  toggleEaten(meal: MealPlan) {
    meal.eaten = !meal.eaten;
  }

  toggleNutrition(meal: MealPlan) {
    meal.expanded = !meal.expanded;
  }

  /* ---------------- SUMMARY ---------------- */
  get totalCalories(): number {
    return this.meals
      .filter(m => m.eaten)
      .reduce((sum, m) => sum + m.calories, 0);
  }

  get remainingCalories(): number {
    return this.dailyCalorieGoal - this.totalCalories;
  }
}