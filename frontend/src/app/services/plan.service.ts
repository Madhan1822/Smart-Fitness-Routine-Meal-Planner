import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://127.0.0.1:5000/api/plans';

  constructor(private http: HttpClient) { }

  getPlans(userId: number, isAdmin: boolean = false): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}?isAdmin=${isAdmin}`);
  }

  updatePlan(planId: number, planData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${planId}`, planData);
  }
}
