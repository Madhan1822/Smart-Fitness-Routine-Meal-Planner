import { Injectable } from '@angular/core';

export interface Workout {
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class FitnessDataService {

  calories = {
    consumed: 1800,
    goal: 2500
  };

  workout = {
    current: 85,
    previous: 70
  };

  workouts: Workout[] = [
    { date: '2024-09-01' },
    { date: '2024-09-03' },
    { date: '2024-09-07' }
  ];

}