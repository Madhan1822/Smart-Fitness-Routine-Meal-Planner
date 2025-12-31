import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.css'
})
export class MealPlannerComponent implements OnInit {
  plans: any[] = [];
  userId: number;

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {
    this.userId = this.authService.getCurrentUser().id;
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
    this.planService.updatePlan(plan.id, plan).subscribe();
  }
}
