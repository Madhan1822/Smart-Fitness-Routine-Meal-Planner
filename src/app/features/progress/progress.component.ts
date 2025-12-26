import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import {  OnInit } from '@angular/core';
import { ProgressService } from '../../core/services/progress.service';

Chart.register(...registerables);

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  constructor(private progressService: ProgressService) {}

  /* ================= SUMMARY ================= */
  currentWeight!: number;
  previousWeight!: number;

  currentBMI!: number;
  previousBMI!: number;

  currentWorkout!: number;
  previousWorkout!: number;

  get weightChange() { return this.currentWeight - this.previousWeight; }
  get bmiChange() { return this.currentBMI - this.previousBMI; }
  get workoutChange() { return this.currentWorkout - this.previousWorkout; }

  get isWeightDown() { return this.weightChange < 0; }
  get isBMIDown() { return this.bmiChange < 0; }
  get isWorkoutUp() { return this.workoutChange > 0; }

  ngOnInit(): void {

  /* ================= SUMMARY ================= */
  const summary = this.progressService.getSummary();

this.currentWeight = summary.weight.current;
this.previousWeight = summary.weight.previous;

this.currentBMI = summary.bmi.current;
this.previousBMI = summary.bmi.previous;

this.currentWorkout = summary.workout.current;
this.previousWorkout = summary.workout.previous;

  /* ================= WEIGHT PROGRESS ================= */
  this.progressService.getWeightProgress().subscribe(data => {
    this.weightChartData.datasets[0].data = data;
  });

  /* ================= DAILY WEIGHT ================= */
  this.progressService.getDailyWeight().subscribe(data => {
    this.dailyWeightChartData.datasets[0].data = data;
  });

  /* ================= BMI PROGRESS ================= */
  this.progressService.getBMIProgress().subscribe(data => {
    this.bmiRadarData.datasets[0].data = data;
  });

  /* ================= WORKOUT CONSISTENCY ================= */
  this.progressService.getWorkoutConsistency().subscribe(data => {
    this.workoutChartData.datasets[0].data = data;
  });

  /* ================= WORKOUT INTENSITY ================= */
  this.progressService.getWorkoutIntensity().subscribe(data => {
    this.workoutIntensityChartData.datasets[0].data = data;
  });

  /* ================= WORKOUT STREAK ================= */
  const streak = this.progressService.getWorkoutStreak();

  this.currentStreak = streak.current;
  this.bestStreak = streak.best;
  this.streakDays = streak.last7Days;
}

  /* ================= WEIGHT BAR ================= */
  weightChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Weight (kg)',
      data: [72, 71, 70, 69],
      backgroundColor: '#42a5f5'
    }]
  };

  /* ================= WORKOUT BAR ================= */
  workoutChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Workout Consistency (%)',
      data: [70, 80, 85, 90],
      backgroundColor: '#ff7043'
    }]
  };

  workoutChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: { min: 0, max: 100 }
    }
  };

  /* ================= BMI RADAR (FIXED) ================= */
  bmiRadarData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
    datasets: [{
      label: 'BMI Status',
      data: [18, 23, 27, 30],
      backgroundColor: 'rgba(63,81,181,0.25)',
      borderColor: '#3f51b5',
      pointBackgroundColor: '#3f51b5'
    }]
  };

  bmiRadarOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    scales: {
      r: {
        min: 15,
        max: 35,
        ticks: { stepSize: 5 }
      }
    }
  };

  /* ================= WORKOUT INTENSITY (DOUGHNUT) ================= */
  workoutIntensityChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Low', 'Moderate', 'High'],
    datasets: [{
      data: [40, 35, 25],
      backgroundColor: ['#4caf50', '#2196f3', '#f44336']
    }]
  };

  workoutIntensityChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '70%'
  };

  /* ================= DAILY WEIGHT VARIABILITY ================= */
  dailyWeightChartType: 'line' = 'line';

  dailyWeightChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Weight (kg)',
      data: [65, 65, 64.8, 64.9, 65, 65, 65],
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63,81,181,0.15)',
      tension: 0.4,
      fill: true
    }]
  };

  dailyWeightChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true
  };

  /* ================= STREAK ================= */
  currentStreak = 6;
  bestStreak = 14;
  streakDays = [true, true, true, true, true, true, false];
}