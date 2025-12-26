import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isSignup = false;
  isAdminMode = false;
  authForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.authForm = this.createLoginForm();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  switchToAdminLogin() {
    this.isAdminMode = true;
    this.errorMessage = '';
    this.authForm.reset();
  }

  backToUserLogin() {
    this.isAdminMode = false;
    this.errorMessage = '';
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password } = this.authForm.value;

    // 🔐 ADMIN LOGIN FLOW
    if (this.isAdminMode) {
      if (!email.includes('admin')) {
        this.errorMessage = 'Admin access only';
        return;
      }

      const success = this.authService.loginAdmin(email, password);

      if (success) {
        console.log('✅ Admin login success → redirecting');
        this.router.navigateByUrl('/admin');
      }
      return;
    }

    // 👤 USER LOGIN FLOW
    const success = this.authService.loginUser(email, password);

    if (success) {
      this.router.navigateByUrl('/dashboard');
    }
  }
  loginAsAdmin() {
  if (this.authForm.invalid) return;

  const { email, password } = this.authForm.value;

  const success = this.authService.loginAdmin(email, password);

  if (success) {
    this.router.navigate(['/admin']); // ✅ force navigation
  } else {
    this.errorMessage = 'Admin access only';
  }
}
}