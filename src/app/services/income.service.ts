
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeRequest, IncomeResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private readonly API_URL = `${environment.apiUrl}/income`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IncomeResponse[]> {
    return this.http.get<IncomeResponse[]>(this.API_URL);
  }

  getById(id: number): Observable<IncomeResponse> {
    return this.http.get<IncomeResponse>(`${this.API_URL}/${id}`);
  }

  create(income: IncomeRequest): Observable<IncomeResponse> {
    return this.http.post<IncomeResponse>(this.API_URL, income);
  }

  update(id: number, income: IncomeRequest): Observable<IncomeResponse> {
    return this.http.put<IncomeResponse>(`${this.API_URL}/${id}`, income);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
