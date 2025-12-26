import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { ADMIN_ROUTES } from './features/admin/admin/admin.routes';

export const routes: Routes = [

  // default
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // auth
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

   {
    path: 'admin',
    component: AdminDashboardComponent,
    children: ADMIN_ROUTES
  },

  // weight — OUTSIDE layout
  // {
  //   path: 'weight',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./features/weight/weight.component')
  //       .then(m => m.WeightComponent),
  // },

  // layout — ONLY AFTER weight
  {
    path: '',
    component: LayoutComponent,
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
      },

      {
        path: 'workout',
        loadComponent: () =>
          import('./features/workout/workout.component')
            .then(m => m.WorkoutComponent),
      },

      {
        path: 'meal',
        loadComponent: () =>
          import('./features/meal/meal.component')
            .then(m => m.MealComponent),
      },

      {
        path: 'progress',
        loadComponent: () =>
          import('./features/progress/progress.component')
            .then(m => m.ProgressComponent),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component')
            .then(m => m.SettingsComponent),
      }
    ]
  }
];