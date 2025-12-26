import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProgramStateService } from '../../core/services/program-state.service';
import { PlannerService } from '../../core/services/planner.service';
import { WeightService } from '../../core/services/weight.service';

/* ================= TYPES ================= */

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type WorkoutFocus = 'Upper Body' | 'Lower Body' | 'Full Body' | 'Cardio';

export interface DayPlan {
  day: string;
  focus: WorkoutFocus | 'Rest';
}

export interface Exercise {
  group: 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core' | 'Cardio';
  name: string;
  sets: string;
  completed: boolean;
}

/* ================= CONSTANTS ================= */

const EXERCISE_GROUPS: Exercise['group'][] = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Cardio'
];

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent implements OnInit {
  constructor(
    private programState: ProgramStateService,
    private plannerService:PlannerService,
    private weightService: WeightService
  ) {}

  /* ---------- LEVEL ---------- */
  levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
  userLevel: Level = 'Beginner';

  /* ---------- TODAY ---------- */
  todayName = '';
  todayCompleted: boolean = false;
  streak = 0;

  todayPlan!: DayPlan;
  todayExercises: Exercise[] = [];

  completedDays: string[] = [];
  exerciseGroups = EXERCISE_GROUPS;
  exerciseProgress: Record<string, boolean> = {};

  /* ---------- WEEKLY PLANS ---------- */
  weeklyPlans: Record<Level, DayPlan[]> = {
    Beginner: [
      { day: 'Monday', focus: 'Upper Body' },
      { day: 'Tuesday', focus: 'Rest' },
      { day: 'Wednesday', focus: 'Lower Body' },
      { day: 'Thursday', focus: 'Rest' },
      { day: 'Friday', focus: 'Full Body' },
      { day: 'Saturday', focus: 'Cardio' },
      { day: 'Sunday', focus: 'Rest' }
    ],
    Intermediate: [
      { day: 'Monday', focus: 'Upper Body' },
      { day: 'Tuesday', focus: 'Lower Body' },
      { day: 'Wednesday', focus: 'Rest' },
      { day: 'Thursday', focus: 'Upper Body' },
      { day: 'Friday', focus: 'Lower Body' },
      { day: 'Saturday', focus: 'Cardio' },
      { day: 'Sunday', focus: 'Rest' }
    ],
    Advanced: [
      { day: 'Monday', focus: 'Upper Body' },
      { day: 'Tuesday', focus: 'Lower Body' },
      { day: 'Wednesday', focus: 'Upper Body' },
      { day: 'Thursday', focus: 'Lower Body' },
      { day: 'Friday', focus: 'Full Body' },
      { day: 'Saturday', focus: 'Cardio' },
      { day: 'Sunday', focus: 'Rest' }
    ]
  };

  /* ---------- WORKOUT LIBRARY ---------- */
  workoutLibrary: Record<Level, Record<WorkoutFocus, Exercise[]>> = {

  /* ================= BEGINNER ================= */
  Beginner: {
    'Upper Body': [
      { group: 'Chest', name: 'Push-ups', sets: '3 × 10', completed: false },
      { group: 'Back', name: 'Dumbbell Rows', sets: '3 × 12', completed: false },
      { group: 'Shoulders', name: 'Shoulder Press', sets: '3 × 12', completed: false },
      { group: 'Arms', name: 'Bicep Curls', sets: '3 × 12', completed: false }
    ],
    'Lower Body': [
      { group: 'Legs', name: 'Bodyweight Squats', sets: '3 × 15', completed: false },
      { group: 'Legs', name: 'Forward Lunges', sets: '3 × 10 each leg', completed: false },
      { group: 'Legs', name: 'Glute Bridges', sets: '3 × 12', completed: false }
    ],
    'Full Body': [
      { group: 'Chest', name: 'Push-ups', sets: '3 × 12', completed: false },
      { group: 'Legs', name: 'Squats', sets: '3 × 15', completed: false },
      { group: 'Core', name: 'Plank', sets: '30s × 3', completed: false }
    ],
    'Cardio': [
      { group: 'Cardio', name: 'Jumping Jacks', sets: '3 × 60s', completed: false },
      { group: 'Cardio', name: 'March in Place', sets: '3 × 2 min', completed: false }
    ]
  },

  /* ================= INTERMEDIATE ================= */
  Intermediate: {
    'Upper Body': [
      { group: 'Chest', name: 'Bench Press', sets: '4 × 10', completed: false },
      { group: 'Back', name: 'Pull-ups', sets: '3 × 8', completed: false },
      { group: 'Shoulders', name: 'Arnold Press', sets: '3 × 10', completed: false },
      { group: 'Arms', name: 'Tricep Dips', sets: '3 × 12', completed: false }
    ],
    'Lower Body': [
      { group: 'Legs', name: 'Barbell Squats', sets: '4 × 10', completed: false },
      { group: 'Legs', name: 'Romanian Deadlifts', sets: '3 × 10', completed: false },
      { group: 'Legs', name: 'Walking Lunges', sets: '3 × 20 steps', completed: false }
    ],
    'Full Body': [
      { group: 'Back', name: 'Deadlifts', sets: '4 × 8', completed: false },
      { group: 'Chest', name: 'Push-ups', sets: '3 × 15', completed: false },
      { group: 'Core', name: 'Russian Twists', sets: '3 × 20', completed: false }
    ],
    'Cardio': [
      { group: 'Cardio', name: 'Burpees', sets: '3 × 15', completed: false },
      { group: 'Cardio', name: 'Jump Rope', sets: '5 min', completed: false }
    ]
  },

  /* ================= ADVANCED ================= */
  Advanced: {
    'Upper Body': [
      { group: 'Chest', name: 'Bench Press', sets: '5 × 8', completed: false },
      { group: 'Back', name: 'Weighted Pull-ups', sets: '4 × 8', completed: false },
      { group: 'Shoulders', name: 'Military Press', sets: '4 × 10', completed: false },
      { group: 'Arms', name: 'Skull Crushers', sets: '3 × 12', completed: false }
    ],
    'Lower Body': [
      { group: 'Legs', name: 'Heavy Squats', sets: '5 × 6', completed: false },
      { group: 'Legs', name: 'Romanian Deadlifts', sets: '4 × 8', completed: false },
      { group: 'Legs', name: 'Walking Lunges', sets: '3 × 20 steps', completed: false },
      { group: 'Core', name: 'Hanging Leg Raises', sets: '3 × 15', completed: false }
    ],
    'Full Body': [
      { group: 'Back', name: 'Deadlifts', sets: '5 × 5', completed: false },
      { group: 'Chest', name: 'Incline Bench Press', sets: '4 × 10', completed: false },
      { group: 'Core', name: 'Ab Wheel Rollouts', sets: '3 × 12', completed: false }
    ],
    'Cardio': [
      { group: 'Cardio', name: 'Sprint Intervals', sets: '6 × 30s', completed: false },
      { group: 'Cardio', name: 'Rowing Machine', sets: '10 min', completed: false }
    ]
  }
};
  /* ================= LIFECYCLE ================= */

 ngOnInit(): void {
  this.setToday();

  if (this.isNewWeek()) {
    this.resetWeek();
  }

  this.loadStreak();
  this.loadCompletedDays();
  this.loadTodayExercises();
}
   toggleExercise(ex: Exercise): void {
    const weight = this.weightService.getLatestWeight();
    const goal = this.programState.goal;

    if (weight && goal) {
      this.userLevel = this.plannerService.getWorkoutLevel(goal, weight);
    }
  const key = `${this.todayName}-${ex.name}`;
  ex.completed = !ex.completed;

  this.exerciseProgress[key] = ex.completed;
  localStorage.setItem('exerciseProgress', JSON.stringify(this.exerciseProgress));

  const allDone = this.todayExercises.every(e => e.completed);
  if (allDone && !this.isCompletedDay(this.todayName)) {
    this.markCompleted();
  }
}
markCompleted(): void {
  if (this.todayPlan.focus === 'Rest') return;

  if (!this.completedDays.includes(this.todayName)) {
    this.completedDays.push(this.todayName);
  }

  if (!this.todayCompleted) {
  this.streak++;
  this.todayCompleted = true;
}

  localStorage.setItem('streak', String(this.streak));
  localStorage.setItem('lastWorkoutDate', new Date().toDateString());
  localStorage.setItem('completedDays', JSON.stringify(this.completedDays));
}

 loadStreak(): void {
  const lastDate = localStorage.getItem('lastWorkoutDate');
  const savedStreak = Number(localStorage.getItem('streak') || 0);
  const today = new Date().toDateString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastDate === today) {
    this.streak = savedStreak;
  } else if (lastDate === yesterday.toDateString()) {
    this.streak = savedStreak;
  } else {
    this.streak = 0;
  }
}

  loadCompletedDays(): void {
  if (this.isNewWeek()) {
    // Reset week progress
    this.completedDays = [];
    localStorage.removeItem('completedDays');
    this.todayCompleted = false;
    return;
  }

  const saved = localStorage.getItem('completedDays');
  this.completedDays = saved ? JSON.parse(saved) : [];
  this.todayCompleted = this.completedDays.includes(this.todayName);
}

  isCompletedDay(day: string): boolean {
    return this.completedDays.includes(day);
  }

 isFutureDay(day: string): boolean {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const todayIndex = days.indexOf(this.todayName);
  const dayIndex = days.indexOf(day);

  // Future day & not completed
  return dayIndex > todayIndex && !this.completedDays.includes(day);
}
  
  loadExerciseProgress(): void {
  const saved = localStorage.getItem('exerciseProgress');
  this.exerciseProgress = saved ? JSON.parse(saved) : {};

  this.todayExercises.forEach(ex => {
    const key = `${this.todayName}-${ex.name}`;
    ex.completed = this.exerciseProgress[key] || false;
  });
 }

  /* ================= LOGIC ================= */

  setToday(): void {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    this.todayName = days[new Date().getDay()];
    this.todayPlan = this.weeklyPlans[this.userLevel]
      .find(d => d.day === this.todayName)!;
  }

  changeLevel(level: Level): void {
    this.userLevel = level;
    this.setToday();
    this.loadTodayExercises();
  }

  loadTodayExercises(): void {
    if (this.todayPlan.focus === 'Rest') {
      this.todayExercises = [];
      return;
    }

    this.todayExercises =
      this.workoutLibrary[this.userLevel][this.todayPlan.focus]
        .map(ex => ({ ...ex, completed: false }));

    this.loadExerciseProgress();
  }

  getExercisesByGroup(group: Exercise['group']): Exercise[] {
    return this.todayExercises.filter(ex => ex.group === group);
  }
  private mapGoalToLevel(goal: 'loss' | 'fit' | 'gain'): Level {
  if (goal === 'loss') return 'Beginner';
  if (goal === 'gain') return 'Advanced';
  return 'Intermediate';
}
isNewWeek(): boolean {
  const lastDate = localStorage.getItem('lastWorkoutDate');
  if (!lastDate) return false;

  const last = new Date(lastDate);
  const today = new Date();

  // If last workout was Sunday and today is Monday
  return last.getDay() === 0 && today.getDay() === 1;
}
resetWeek(): void {
  this.completedDays = [];
  this.todayCompleted = false;

  localStorage.removeItem('completedDays');
  localStorage.removeItem('exerciseProgress');

  // Force UI refresh
  this.setToday();
}
}