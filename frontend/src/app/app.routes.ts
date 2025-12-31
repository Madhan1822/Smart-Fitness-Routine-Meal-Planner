import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WorkoutRoutineComponent } from './components/workout-routine/workout-routine.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'workouts', component: WorkoutRoutineComponent, canActivate: [authGuard] },
    { path: 'meals', component: MealPlannerComponent, canActivate: [authGuard] },
    { path: 'progress', component: ProgressTrackerComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
