import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  private STREAK_KEY = 'workout_streak';
  private DATE_KEY = 'last_workout_date';

  getStreak(): number {
    return Number(localStorage.getItem(this.STREAK_KEY)) || 0;
  }

  completeWorkout(): number {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(this.DATE_KEY);

    let streak = this.getStreak();

    if (lastDate !== today) {
      if (this.isYesterday(lastDate)) {
        streak += 1;
      } else {
        streak = 1;
      }

      localStorage.setItem(this.STREAK_KEY, String(streak));
      localStorage.setItem(this.DATE_KEY, today);
    }

    return streak;
  }

  private isYesterday(date: string | null): boolean {
    if (!date) return false;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return new Date(date).toDateString() === yesterday.toDateString();
  }
}