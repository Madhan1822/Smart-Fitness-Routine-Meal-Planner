import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Gender = 'male' | 'female';
export type Goal = 'fit' | 'loss' | 'gain';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ProgramState {
  gender: Gender | null;
  goal: Goal | null;
  level: Level | null;
  heightCm: number | null;
  startedOn: string | null;
  isActive: boolean;
}

const STORAGE_KEY = 'activeProgram';

@Injectable({ providedIn: 'root' })
export class ProgramStateService {
  getHeight(): number | null {
  return this.state$.value.heightCm;
}

  private state$ = new BehaviorSubject<ProgramState>({
    gender: null,
    goal: null,
    level: null,
    heightCm: null,
    startedOn: null,
    isActive: false
  });

  program$ = this.state$.asObservable();

  /* ===== FIX: LOAD STATE ON APP START ===== */
  loadFromStorage(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    this.state$.next(JSON.parse(saved));
  }

  /* ===== GETTERS ===== */
  get gender() { return this.state$.value.gender; }
  get goal() { return this.state$.value.goal; }
  get level() { return this.state$.value.level; }
  get startedOn() { return this.state$.value.startedOn; }
  get isActive() { return this.state$.value.isActive; }

  /* ===== SETTERS ===== */
  setGender(gender: Gender) {
    if (this.isActive) return;
    this.update({ gender });
  }

  setGoal(goal: Goal) {
    if (this.isActive) return;
    this.update({ goal });
  }

  setLevel(level: Level) {
    if (this.isActive) return;
    this.update({ level });
  }

  startProgram(): void {
    const current = this.state$.value;
    if (!current.gender || !current.goal || !current.level) return;

    this.update({
      isActive: true,
      startedOn: new Date().toDateString()
    });
  }

  resetProgram(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state$.next({
      gender: null,
      goal: null,
      level: null,
      heightCm: null,
      startedOn: null,
      isActive: false
    });
  }

  private update(partial: Partial<ProgramState>) {
    const updated = { ...this.state$.value, ...partial };
    this.state$.next(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}