import { Injectable } from '@angular/core';

interface WeightEntry {
  week: string;
  weight: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeightService {

  private STORAGE_KEY = 'user_weight_history';

  /* ---------------- HELPERS ---------------- */

  private getCurrentWeek(): string {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(
      (((now.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7
    );
    return `${now.getFullYear()}-W${week}`;
  }

  private getHistory(): WeightEntry[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveHistory(history: WeightEntry[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  /* ---------------- CORE API ---------------- */

  saveWeeklyWeight(weight: number): void {
    const history = this.getHistory();
    const currentWeek = this.getCurrentWeek();

    const alreadyExists = history.some(h => h.week === currentWeek);
    if (alreadyExists) return;

    history.push({
      week: currentWeek,
      weight,
      date: new Date().toISOString()
    });

    this.saveHistory(history);
  }

  hasEntryThisWeek(): boolean {
    const history = this.getHistory();
    const currentWeek = this.getCurrentWeek();
    return history.some(h => h.week === currentWeek);
  }

  getLatestWeight(): number | null {
    const history = this.getHistory();
    return history.length ? history[history.length - 1].weight : null;
  }

  getPreviousWeight(): number | null {
    const history = this.getHistory();
    return history.length > 1
      ? history[history.length - 2].weight
      : null;
  }

  getWeightTrend(): 'up' | 'down' | 'stable' | 'none' {
    const current = this.getLatestWeight();
    const previous = this.getPreviousWeight();

    if (current === null || previous === null) return 'none';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }
  getWeightHistory(): { week: string; weight: number; date: string }[] {
  const raw = localStorage.getItem('user_weight_history');
  return raw ? JSON.parse(raw) : [];
}
}