
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseCategoryRequest, ExpenseCategoryResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {
  private readonly API_URL = `${environment.apiUrl}/expense-category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExpenseCategoryResponse[]> {
    return this.http.get<ExpenseCategoryResponse[]>(this.API_URL);
  }

  getById(id: number): Observable<ExpenseCategoryResponse> {
    return this.http.get<ExpenseCategoryResponse>(`${this.API_URL}/${id}`);
  }

  create(category: ExpenseCategoryRequest): Observable<ExpenseCategoryResponse> {
    return this.http.post<ExpenseCategoryResponse>(this.API_URL, category);
  }

  update(id: number, category: ExpenseCategoryRequest): Observable<ExpenseCategoryResponse> {
    return this.http.put<ExpenseCategoryResponse>(`${this.API_URL}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
