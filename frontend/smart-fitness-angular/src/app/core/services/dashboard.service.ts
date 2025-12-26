import { Injectable } from '@angular/core';

export interface DashboardStats {
  workoutsCompleted: number;
  mealsPlanned: number;
  progressPercent: number;
  weeklyWorkouts: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getDashboardStats(): DashboardStats {
    return {
      workoutsCompleted: 12,
      mealsPlanned: 7,
      progressPercent: 3,
      weeklyWorkouts: [1, 0, 1, 1, 0, 1, 2]
    };
  }
}