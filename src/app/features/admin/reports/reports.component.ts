import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  displayedColumns: string[] = ['id', 'user', 'type', 'date', 'status'];

  reports = [
    {
      id: 1,
      user: 'Ganesh',
      type: 'Progress Report',
      date: '2025-01-10',
      status: 'Completed'
    },
    {
      id: 2,
      user: 'Varun',
      type: 'Diet Report',
      date: '2025-01-12',
      status: 'Pending'
    }
  ];
}