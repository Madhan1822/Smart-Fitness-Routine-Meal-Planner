import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent {

  displayedColumns = ['id', 'name', 'duration', 'level'];

  programs = [
    { id: 1, name: 'Weight Loss', duration: '8 Weeks', level: 'Beginner' },
    { id: 2, name: 'Muscle Gain', duration: '12 Weeks', level: 'Intermediate' },
    { id: 3, name: 'Fitness', duration: '6 Weeks', level: 'Beginner' }
  ];
}