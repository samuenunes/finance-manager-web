
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseRequest, ExpenseResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = `${environment.apiUrl}/expense`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(this.API_URL);
  }

  getById(id: number): Observable<ExpenseResponse> {
    return this.http.get<ExpenseResponse>(`${this.API_URL}/${id}`);
  }

  create(expense: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(this.API_URL, expense);
  }

  update(id: number, expense: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.put<ExpenseResponse>(`${this.API_URL}/${id}`, expense);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
