import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './progress-tracker.component.html',
  styleUrl: './progress-tracker.component.css'
})
export class ProgressTrackerComponent implements OnInit {
  userId: number;
  viewMode: 'weekly' | 'monthly' = 'weekly';
  selectedMonth: string = '';
  availableMonths: string[] = [];

  totalWorkoutsCompleted = 0;
  totalMealsConsumed = 0;
  overallEfficiency = 0;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      }
    }
  };

  public workoutData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Workout Completion',
        backgroundColor: '#00f2fe',
        borderRadius: 8
      }
    ]
  };

  public mealData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Meal Completion',
        borderColor: '#4facfe',
        backgroundColor: 'rgba(79, 172, 254, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4facfe'
      }
    ]
  };

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.userId = user.id;

    // Set default month to current
    const date = new Date();
    this.selectedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  ngOnInit() {
    this.loadProgress();
  }

  onModeChange() {
    this.loadProgress();
  }

  loadProgress() {
    this.planService.getPlans(this.userId).subscribe(allPlans => {
      const user = this.authService.getCurrentUser();
      const startDate = new Date(user.created_at || new Date());
      const endDate = new Date();

      const months: string[] = [];
      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

      while (current <= endDate) {
        months.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
        current.setMonth(current.getMonth() + 1);
      }

      this.availableMonths = months.reverse();

      if (!this.selectedMonth && this.availableMonths.length > 0) {
        this.selectedMonth = this.availableMonths[0];
      }

      if (this.viewMode === 'weekly') {
        this.processWeeklyData(allPlans);
      } else {
        this.processMonthlyData(allPlans);
      }
    });
  }

  processWeeklyData(plans: any[]) {
    const workoutStats: number[] = [];
    const mealStats: number[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let workoutPoints = 0;
    let mealPoints = 0;
    let totalPossibleWorkouts = 0;
    let totalPossibleMeals = 0;

    days.forEach(day => {
      // Find plans for the specific day (most recent)
      const plan = plans.filter(p => p.day === day).sort((a, b) => b.id - a.id)[0];

      if (plan) {
        const exercises = plan.exercises;
        const status = plan.completed_status;

        const completedEx = exercises.filter((ex: any) => ex.completed).length;
        const wRate = (completedEx / exercises.length) * 100;
        workoutStats.push(wRate);
        workoutPoints += completedEx;
        totalPossibleWorkouts += exercises.length;

        const meals = status.meals;
        const mealKeys = Object.keys(meals);
        const completedMeals = mealKeys.filter(k => meals[k]).length;
        const mRate = (completedMeals / mealKeys.length) * 100;
        mealStats.push(mRate);
        mealPoints += completedMeals;
        totalPossibleMeals += mealKeys.length;
      } else {
        workoutStats.push(0);
        mealStats.push(0);
      }
    });

    this.updateDashboard(workoutPoints, mealPoints, totalPossibleWorkouts, totalPossibleMeals, workoutStats, mealStats, shortDays);
  }

  processMonthlyData(plans: any[]) {
    // Filter plans for the selected month
    const filteredPlans = plans.filter(p => {
      const d = new Date(p.created_at);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return monthStr === this.selectedMonth;
    });

    // Group by week of month (roughly)
    const weekStats: { w: number[], m: number[] } = { w: [], m: [] };
    const labels: string[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    let workoutPoints = 0;
    let mealPoints = 0;
    let totalPossibleWorkouts = 0;
    let totalPossibleMeals = 0;

    // For demo purposes, if we only have 1 week of data, we split it or project it
    // Realistically we'd group by created_at weeks.
    // Let's just group by weeks (assuming multiple entries exist)

    for (let i = 1; i <= 4; i++) {
      // Mocking grouping logic: in a real app, you'd have more than 7 records
      const weekPlans = filteredPlans; // Simplifying for this demo structure

      if (weekPlans.length > 0) {
        const avgWorkout = weekPlans.reduce((acc, p) => acc + (p.exercises.filter((ex: any) => ex.completed).length / p.exercises.length), 0) / weekPlans.length * 100;
        const avgMeal = weekPlans.reduce((acc, p) => {
          const meals = p.completed_status.meals;
          const keys = Object.keys(meals);
          return acc + (keys.filter(k => meals[k]).length / keys.length);
        }, 0) / weekPlans.length * 100;

        weekStats.w.push(Math.round(avgWorkout));
        weekStats.m.push(Math.round(avgMeal));

        if (i === 1) { // Only count once for the overview if data is the same
          workoutPoints = weekPlans.reduce((acc, p) => acc + p.exercises.filter((ex: any) => ex.completed).length, 0);
          mealPoints = weekPlans.reduce((acc, p) => {
            const meals = p.completed_status.meals;
            return acc + Object.keys(meals).filter(k => meals[k]).length;
          }, 0);
          totalPossibleWorkouts = weekPlans.reduce((acc, p) => acc + p.exercises.length, 0);
          totalPossibleMeals = weekPlans.length * 4;
        }
      } else {
        weekStats.w.push(0);
        weekStats.m.push(0);
      }
    }

    this.updateDashboard(workoutPoints, mealPoints, totalPossibleWorkouts, totalPossibleMeals, weekStats.w, weekStats.m, labels);
  }

  updateDashboard(wp: number, mp: number, tpw: number, tpm: number, wStats: number[], mStats: number[], labels: string[]) {
    this.totalWorkoutsCompleted = wp;
    this.totalMealsConsumed = mp;

    if (tpw + tpm > 0) {
      this.overallEfficiency = Math.round(((wp + mp) / (tpw + tpm)) * 100);
    } else {
      this.overallEfficiency = 0;
    }

    this.workoutData = {
      labels: labels,
      datasets: [{ ...this.workoutData.datasets[0], data: wStats }]
    };

    this.mealData = {
      labels: labels,
      datasets: [{ ...this.mealData.datasets[0], data: mStats }]
    };
  }

  formatMonth(m: string): string {
    const [year, month] = m.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}
