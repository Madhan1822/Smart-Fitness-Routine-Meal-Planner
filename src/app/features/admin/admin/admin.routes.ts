import { Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'users', component: UserManagementComponent },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];