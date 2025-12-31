import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PlanService } from '../../services/plan.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, MatIconModule, MatTooltipModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedUser: any = null;
  userPlans: any[] = [];
  activeTab: 'plans' | 'progress' = 'plans';

  viewMode: 'weekly' | 'monthly' = 'weekly';
  selectedMonth: string = '';
  availableMonths: string[] = [];

  // Global System Analytics Stats
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    avgEfficiency: 0,
    goals: { 'weight loss': 0, 'muscle gain': 0, 'maintenance': 0 }
  };

  userProgress = {
    totalWorkouts: 0,
    totalMeals: 0,
    efficiency: 0
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    },
    plugins: { legend: { display: false } }
  };

  // Global Analytics Charts
  public globalGoalData: ChartData<'pie'> = {
    labels: ['Weight Loss', 'Muscle Gain', 'Maintenance'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#ff007a', '#00f2fe', '#10b981'],
      borderWidth: 0
    }]
  };

  public registrationTrendData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0],
      borderColor: '#00f2fe',
      backgroundColor: 'rgba(0, 242, 254, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // Individual User Charts
  public workoutData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], label: 'Workouts', backgroundColor: '#00f2fe', borderRadius: 6 }]
  };

  public mealData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
      label: 'Meals',
      borderColor: '#4facfe',
      backgroundColor: 'rgba(79, 172, 254, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  constructor(
    private authService: AuthService,
    private planService: PlanService
  ) {
    const date = new Date();
    this.selectedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users.filter((u: any) => u.role !== 'admin');
      this.filteredUsers = this.users;
      this.calculateOverviewStats();
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  calculateOverviewStats() {
    this.stats.totalUsers = this.users.length;
    this.stats.goals = { 'weight loss': 0, 'muscle gain': 0, 'maintenance': 0 };

    const joinMonths: { [key: string]: number } = {};

    this.users.forEach(u => {
      // Goal stats
      if (this.stats.goals.hasOwnProperty(u.goal)) {
        (this.stats.goals as any)[u.goal]++;
      }

      // Join Trends
      const joinDate = new Date(u.created_at);
      const month = joinDate.toLocaleString('default', { month: 'short' });
      joinMonths[month] = (joinMonths[month] || 0) + 1;
    });

    // Update Global Charts
    this.globalGoalData = {
      ...this.globalGoalData,
      datasets: [{
        ...this.globalGoalData.datasets[0],
        data: [this.stats.goals['weight loss'], this.stats.goals['muscle gain'], this.stats.goals['maintenance']]
      }]
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      let idx = currentMonthIdx - i;
      if (idx < 0) idx += 12;
      last6Months.push(months[idx]);
    }

    this.registrationTrendData = {
      labels: last6Months,
      datasets: [{
        ...this.registrationTrendData.datasets[0],
        data: last6Months.map(m => joinMonths[m] || 0)
      }]
    };
  }

  viewUserDetails(user: any) {
    this.selectedUser = user;
    this.activeTab = 'plans';
    this.loadUserPlans();
  }

  loadUserPlans() {
    this.planService.getPlans(this.selectedUser.id, true).subscribe(plans => {
      this.userPlans = plans;

      const startDate = new Date(this.selectedUser.created_at || new Date());
      const endDate = new Date();
      const generatedMonths: string[] = [];
      let currentMonthIterator = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

      while (currentMonthIterator <= endDate) {
        generatedMonths.push(`${currentMonthIterator.getFullYear()}-${String(currentMonthIterator.getMonth() + 1).padStart(2, '0')}`);
        currentMonthIterator.setMonth(currentMonthIterator.getMonth() + 1);
      }

      this.availableMonths = generatedMonths.reverse();
      if (!this.selectedMonth && this.availableMonths.length > 0) {
        this.selectedMonth = this.availableMonths[0];
      }

      this.refreshProgressView();
    });
  }

  refreshProgressView() {
    if (this.viewMode === 'weekly') {
      this.calculateWeeklyProgress(this.userPlans);
    } else {
      this.calculateMonthlyProgress(this.userPlans);
    }
  }

  calculateWeeklyProgress(plans: any[]) {
    let wReached = 0, mReached = 0, totalW = 0, totalM = 0;
    const workoutStats: number[] = [0, 0, 0, 0, 0, 0, 0];
    const mealStats: number[] = [0, 0, 0, 0, 0, 0, 0];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day, idx) => {
      const plan = plans.filter(p => p.day === day).sort((a, b) => b.id - a.id)[0];
      if (plan) {
        const doneEx = plan.exercises.filter((ex: any) => ex.completed).length;
        workoutStats[idx] = Math.round((doneEx / plan.exercises.length) * 100);
        wReached += doneEx;
        totalW += plan.exercises.length;

        const meals = plan.completed_status.meals;
        const keys = Object.keys(meals);
        const doneMeals = keys.filter(k => meals[k]).length;
        mealStats[idx] = Math.round((doneMeals / keys.length) * 100);
        mReached += doneMeals;
        totalM += keys.length;
      }
    });

    this.updateCharts(wReached, mReached, totalW, totalM, workoutStats, mealStats, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  }

  calculateMonthlyProgress(plans: any[]) {
    const filtered = plans.filter(p => {
      const d = new Date(p.created_at);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === this.selectedMonth;
    });

    let wReached = 0, mReached = 0, totalW = 0, totalM = 0;
    const wStats: number[] = [0, 0, 0, 0];
    const mStats: number[] = [0, 0, 0, 0];
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    if (filtered.length > 0) {
      const avgWorkout = filtered.reduce((acc, p) => acc + (p.exercises.filter((ex: any) => ex.completed).length / p.exercises.length), 0) / filtered.length * 100;
      const avgMeal = filtered.reduce((acc, p) => {
        const meals = p.completed_status.meals;
        const keys = Object.keys(meals);
        return acc + (keys.filter(k => meals[k]).length / keys.length);
      }, 0) / filtered.length * 100;

      wStats.fill(Math.round(avgWorkout));
      mStats.fill(Math.round(avgMeal));

      wReached = filtered.reduce((acc, p) => acc + p.exercises.filter((ex: any) => ex.completed).length, 0);
      totalW = filtered.reduce((acc, p) => acc + p.exercises.length, 0);
      mReached = filtered.reduce((acc, p) => {
        const meals = p.completed_status.meals;
        return acc + Object.keys(meals).filter(k => meals[k]).length;
      }, 0);
      totalM = filtered.length * 4;
    }

    this.updateCharts(wReached, mReached, totalW, totalM, wStats, mStats, labels);
  }

  updateCharts(wp: number, mp: number, tw: number, tm: number, wStats: number[], mStats: number[], labels: string[]) {
    this.userProgress.totalWorkouts = wp;
    this.userProgress.totalMeals = mp;
    this.userProgress.efficiency = tw + tm > 0 ? Math.round(((wp + mp) / (tw + tm)) * 100) : 0;

    this.workoutData = {
      labels: labels,
      datasets: [{ ...this.workoutData.datasets[0], data: wStats }]
    };

    this.mealData = {
      labels: labels,
      datasets: [{ ...this.mealData.datasets[0], data: mStats }]
    };
  }

  approvePlan(plan: any) {
    this.planService.updatePlan(plan.id, { is_approved: true }).subscribe(() => {
      plan.is_approved = 1;
    });
  }

  savePlanChanges(plan: any) {
    this.planService.updatePlan(plan.id, { exercises: plan.exercises, meals: plan.meals }).subscribe(() => {
      alert('Plan changes saved successfully');
    });
  }

  formatMonth(m: string): string {
    const [year, month] = m.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  closeDetails() {
    this.selectedUser = null;
  }

  trackByFn(index: any) { return index; }
}
