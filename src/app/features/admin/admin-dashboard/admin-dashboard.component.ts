import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserManagementComponent } from '../user-management/user-management.component';
import { MatCardModule } from '@angular/material/card';
import { ProgramsComponent } from '../programs/programs.component';
import { ReportsComponent } from '../reports/reports.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,RouterOutlet,UserManagementComponent,MatCardModule,ProgramsComponent,ReportsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

   activeView: 'none' | 'users' | 'programs' | 'reports' = 'none'

  showUsers() {
    this.activeView = 'users';
  }

  showPrograms() {
    this.activeView = 'programs';
  }

  showReports() {
    this.activeView = 'reports';
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}