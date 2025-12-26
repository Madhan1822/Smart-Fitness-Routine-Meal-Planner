import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { FitnessDataService } from '../../core/services/fitness-data.service';
import { ProgramStateService, Gender, Goal } from '../../core/services/program-state.service';
import { WeightService } from '../../core/services/weight.service';
import { ChartSeries, ProgressService } from '../../core/services/progress.service';

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  ChartType,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  registerables,
  Tooltip
} from 'chart.js';

// interface DashboardData {
//   calories: {
//     consumed: number;
//   };
//   workout: {
//     current: number;
//   };
// }


Chart.register(...registerables,LineController,LineElement,
  PointElement,LinearScale,CategoryScale,BarController,BarElement,Tooltip,Legend);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  

  /* ================= PROGRAM ================= */


  // type Gender = 'male' | 'female';
  // type Goal = 'fit' | 'loss' | 'gain';
  selectedGender: string | null = null;
  selectedGoal: string | null = null;

  savedGender: string | null = null;
  savedGoal: string | null = null;

  // isProgramEditable = false;
  // isProgramStarted = false;  
  activeGender: Gender | null = null;
  activeGoal: Goal | null = null;
  activeLevel: string | null = null;
  programStartedOn: string | null = null;
  isProgramStarted = false;
  isProgramEditable = false;
  weightChart!: ChartSeries;
  workoutChart!: ChartSeries;
  

  genders: Gender[] = ['male', 'female'];
  goals: Goal[] = ['fit', 'loss', 'gain'];

  weightChartData: number[] = [];
  // workoutChartData: number[] = [];
  dailyWeightData: number[] = [];
  workoutIntensityData: number[] = [];
  // weightChartLabels: string[] = [];
  // weightChartValues: number[] = [];

  // workoutChartLabels: string[] = [];
  // workoutChartValues: number[] = [];

  /* ================= WEIGHT ================= */
  weight: number | null = null;
  hasWeight = false;
  canUpdateWeight = true;

  weightHistory: { weight: number; date: string; week: string }[] = [];

  weightChangeAbs = 0;
  weightTrendDirection: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
  weightTrendStatus: 'GOOD' | 'BAD' | 'NEUTRAL' = 'NEUTRAL';

  /* ================= STATS ================= */
  workoutsThisWeek = 0;
  workoutsThisMonth = 0;
  // animatedStreak = 0;
  isEditingWeight = false;
  weightWarning = '';
  isEditingProgram = false;
  // ===== Animated dashboard numbers =====
  animatedCalories: number = 0;
  animatedStreak: number = 0;
  animatedWorkouts: number = 0;

  constructor(
    public fitnessData: FitnessDataService,
    public programState: ProgramStateService,
    public weightService: WeightService,
    private progressService: ProgressService
  ) {}

  

  /* ================= INIT ================= */
 ngOnInit(): void {

  // PROGRAM STATE
  this.programState.loadFromStorage();
  this.programState.program$.subscribe(state => {
    this.activeGender = state.gender;
    this.activeGoal = state.goal;
    this.activeLevel = state.level;
    this.programStartedOn = state.startedOn;
    this.isProgramStarted = state.isActive;
  });

  // SUMMARY
  const summary = this.progressService.getSummary();

  this.animatedCalories = summary.calories.current;
  this.animatedStreak   = summary.workout.current;
  this.animatedWorkouts = summary.workouts.total;

  // WEIGHT
  this.weight = this.weightService.getLatestWeight();
  this.hasWeight = this.weight !== null;
  this.canUpdateWeight = !this.weightService.hasEntryThisWeek();

  // CHART DATA
  this.progressService.getWeightProgress().subscribe(data => {
    this.weightChartData = data;
  });

  // this.progressService.getWorkoutProgress().subscribe(data => {
  //   this.workoutChartData = data;
  // });

  this.progressService.getDailyWeight().subscribe(data => {
    this.dailyWeightData = data;
  });

  this.progressService.getWorkoutIntensity().subscribe(data => {
    this.workoutIntensityData = data;
  });
}

  ngAfterViewInit(): void {
  this.weightChart = this.progressService.getWeightChart();
  this.workoutChart = this.progressService.getWorkoutChart();

  this.renderWeightChart();
  this.renderWorkoutChart();
}
  private calculateWorkoutCounts() {
  const now = new Date();

  this.workoutsThisWeek = this.fitnessData.workouts.filter(
    (w: { date: string }) => {
      const d = new Date(w.date);
      const diff =
        (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }
  ).length;

  this.workoutsThisMonth = this.fitnessData.workouts.filter(
    (w: { date: string }) => {
      const d = new Date(w.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }
  ).length;
}

 
  /* ================= WEIGHT ACTIONS ================= */

  saveWeight() {
    if (this.weight === null) return;

    this.weightService.saveWeeklyWeight(this.weight);
    this.hasWeight = true;
    this.canUpdateWeight = false;

    this.weightHistory = this.weightService.getWeightHistory();
    this.calculateWeightTrend();
  }

  editWeight() {
  if (!this.canUpdateWeight) {
    this.weightWarning =
      'You can update your weight only once per week.';
    return;
  }

  this.isEditingWeight = true;
  this.weightWarning = '';
}

  private calculateWeightTrend() {
    if (this.weightHistory.length < 2) {
      this.weightTrendDirection = 'STABLE';
      this.weightTrendStatus = 'NEUTRAL';
      this.weightChangeAbs = 0;
      return;
    }

    const last = this.weightHistory.at(-1)!.weight;
    const prev = this.weightHistory.at(-2)!.weight;
    const diff = +(last - prev).toFixed(1);

    this.weightChangeAbs = Math.abs(diff);
    this.weightTrendDirection = diff > 0 ? 'UP' : diff < 0 ? 'DOWN' : 'STABLE';

    if (this.activeGoal === 'loss') this.weightTrendStatus = diff < 0 ? 'GOOD' : 'BAD';
    else if (this.activeGoal === 'gain') this.weightTrendStatus = diff > 0 ? 'GOOD' : 'BAD';
    else this.weightTrendStatus = Math.abs(diff) <= 0.5 ? 'GOOD' : 'BAD';
  }

  updateWeightTrend() {
  if (this.weightHistory.length < 2) {
    this.weightTrendDirection = 'STABLE';
    this.weightTrendStatus = 'NEUTRAL';
    return;
  }

  const last = this.weightHistory[this.weightHistory.length - 1].weight;
  const prev = this.weightHistory[this.weightHistory.length - 2].weight;

  if (last < prev) {
    this.weightTrendDirection = 'DOWN';
    this.weightTrendStatus = 'GOOD';   // weight loss is good
  } else if (last > prev) {
    this.weightTrendDirection = 'UP';
    this.weightTrendStatus = 'BAD';
  } else {
    this.weightTrendDirection = 'STABLE';
    this.weightTrendStatus = 'NEUTRAL';
  }
}
  
   renderWeightChart() {
  new Chart('weightChart', {
    type: 'line',
    data: {
      labels: this.weightChart.labels,
      datasets: [{
        label: 'Weight (kg)',
        data: this.weightChart.data,
        borderColor: '#3f51b5',
        tension: 0.4
      }]
    }
  });
}

renderWorkoutChart() {
  new Chart('workoutChart', {
    type: 'bar',
    data: {
      labels: this.workoutChart.labels,
      datasets: [{
        label: 'Workouts',
        data: this.workoutChart.data,
        backgroundColor: '#3f51b5'
      }]
    }
  });
}

  /* ================= GETTERS ================= */

  get caloriesConsumed() {
    return this.fitnessData.calories.consumed;
  }

  get caloriesGoal() {
    return this.fitnessData.calories.goal;
  }

  /* ================= PROGRAM ================= */
  onEditProgram() {
  this.isProgramEditable = true;

  // Reset to default when editing
  this.activeGender = null;
  this.activeGoal = null;
}


  editProgram() {
  this.isEditingProgram = true;
  }


  enableProgramEdit() {
  this.isProgramEditable = true;
  this.activeGender = null; // reset to default
  this.activeGoal = null;   // reset to default
}

 /* Enable editing */
onChangeProgram() {
  this.isProgramEditable = true;

  // RESET selections to force default
  this.activeGender = null;
  this.activeGoal = null;
}

/* Save program */
onSaveProgram() {
  if (!this.activeGender || !this.activeGoal) {
    alert('Please select Gender and Goal');
    return;
  }

  this.isProgramStarted = true;
  this.isProgramEditable = false;

  console.log('Program saved:', this.activeGender, this.activeGoal);
}
  onGenderChange(value: Gender) {
    this.programState.setGender(value);
  }

  onGoalChange(value: Goal) {
    this.programState.setGoal(value);
  }

  onStartProgram() {
    this.programState.startProgram();
  }

  onResetProgram() {
    this.programState.resetProgram();
  }
}