import { Injectable } from '@angular/core';

export type UserRole = 'USER' | 'ADMIN';

const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  loginUser(email: string, password: string): boolean {
  if (email && password) {
    localStorage.setItem('auth_token', 'user-token');
    localStorage.setItem('auth_role', 'USER');
    localStorage.setItem('auth_email', email);
    return true;
  }
  return false;
}

  loginAdmin(email: string, password: string): boolean {
  if (email === 'admin@gmail.com' && password === '123456') {
    localStorage.setItem('auth_token', 'admin-token');
    localStorage.setItem('auth_role', 'ADMIN');
    localStorage.setItem('auth_email', email); // ✅ ADD THIS
    return true;
  }
  return false;
}
  getUserEmail(): string | null {
  return localStorage.getItem('auth_email');
}

  logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_role');
  localStorage.removeItem('auth_email');
   localStorage.clear();
}

  isLoggedIn(): boolean {
  return !!localStorage.getItem('auth_token');
}

getRole(): 'ADMIN' | 'USER' | null {
  return localStorage.getItem('auth_role') as 'ADMIN' | 'USER' | null;
}

isAdmin(): boolean {
  return this.getRole() === 'ADMIN';
}
}