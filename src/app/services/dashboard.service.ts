import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatsResponse, BalanceHistoryItem, MonthlyStatResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(this.API_URL);
  }

  getBalanceHistory(months = 6): Observable<BalanceHistoryItem[]> {
    return this.http.get<BalanceHistoryItem[]>(`${this.API_URL}/balance-history?months=${months}`);
  }

  getMonthlyStats(year: number): Observable<MonthlyStatResponse[]> {
    return this.http.get<MonthlyStatResponse[]>(`${this.API_URL}/monthly?year=${year}`);
  }
  
}
