import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WeightService } from './weight.service';
import { ProgramStateService } from './program-state.service';

export interface ProgressSummary {
  calories: {
    current: number;
    previous: number;
  };
  workout: {
    current: number;
    previous: number;
  };
  workouts: {
    total: number;
  };
  weight: {
    current: number;
    previous: number;
  };
  bmi: {
    current: number;
    previous: number;
  };
}

export interface ChartSeries {
  labels: string[];
  data: number[];
}

export interface ChartPoint {
  label: string;
  value: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(
  private weightService: WeightService,
  private programState: ProgramStateService
) {}

  /* ================= SUMMARY ================= */
   getSummary(): ProgressSummary {
  const weights = this.weightService.getWeightHistory();
  const latest = weights.at(-1)?.weight ?? 65;
  const previous = weights.at(-2)?.weight ?? latest;

  const heightCm = this.programState.getHeight() ?? 170;

  return {
    calories: {
      current: 1800,
      previous: 1700
    },
    workout: {
      current: 4,
      previous: 3
    },
    workouts: {
      total: 12
    },
    weight: {
      current: latest,
      previous
    },
    bmi: {
      current: this.calculateBMI(latest, heightCm),
      previous: this.calculateBMI(previous, heightCm)
    }
  };
}
  
 
  private calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

  /* ================= WEIGHT ================= */
  getWeightProgress(): Observable<number[]> {
    return of([72, 71, 70, 69]);
  }

  getDailyWeight(): Observable<number[]> {
    return of([65, 65, 64.8, 64.9, 65, 65, 65]);
  }

  /* ================= BMI ================= */
  getBMIProgress(): Observable<number[]> {
    return of([24.5, 23.8, 23.2, 22.8]);
  }

  /* ================= WORKOUT ================= */
  getWorkoutConsistency(): Observable<number[]> {
    return of([70, 80, 85, 90]);
  }

  getWorkoutIntensity(): Observable<number[]> {
    return of([40, 35, 25]); // Low, Moderate, High
  }

  getWorkoutStreak() {
    return {
      current: 6,
      best: 14,
      last7Days: [true, true, true, true, true, true, false]
    };
  }
  getWeightChart(): ChartSeries {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [65, 65, 64.8, 64.9, 65, 65, 65]
  };
}

getWorkoutChart(): ChartSeries {
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [3, 4, 2, 5]
  };
}
getWorkoutProgress(): Observable<number[]> {
  return of([3, 4, 2, 5]);
}
}