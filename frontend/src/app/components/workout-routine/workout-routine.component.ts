import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-workout-routine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './workout-routine.component.html',
  styleUrl: './workout-routine.component.css'
})
export class WorkoutRoutineComponent implements OnInit {
  plans: any[] = [];
  userId: number;
  userGoal: string = '';

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.userId = user.id;
    this.userGoal = user.goal;
  }

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getPlans(this.userId).subscribe(plans => {
      this.plans = plans;
    });
  }

  updateStatus(plan: any) {
    this.planService.updatePlan(plan.id, plan).subscribe(() => {
      if (this.getCompletionRate(plan) === 100) {
        this.celebrate();
      }
    });
  }

  celebrate() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#ff007a']
    });
  }

  getCompletionRate(plan: any): number {
    if (!plan.exercises || plan.exercises.length === 0) return 0;
    const completed = plan.exercises.filter((ex: any) => ex.completed).length;
    return Math.round((completed / plan.exercises.length) * 100);
  }

  isDayDone(plan: any): boolean {
    return this.getCompletionRate(plan) === 100;
  }
}
