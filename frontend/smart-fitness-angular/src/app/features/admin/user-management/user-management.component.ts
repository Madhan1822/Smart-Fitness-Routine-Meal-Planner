import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {

  displayedColumns: string[] = ['id', 'name', 'email', 'goal', 'actions'];

  users = [
    { id: 1, name: 'Ganesh', email: 'ganesh@gmail.com', goal: 'Weight Loss' },
    { id: 2, name: 'Varun', email: 'varun@gmail.com', goal: 'Muscle Gain' },
    { id: 3, name: 'Yasani', email: 'yasani@gmail.com', goal: 'Fitness' }
  ];

  editUser(user: any) {
    alert('Edit user: ' + user.name);
  }

  deleteUser(user: any) {
    const confirmDelete = confirm(`Delete ${user.name}?`);
    if (confirmDelete) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }
}