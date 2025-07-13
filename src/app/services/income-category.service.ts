
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeCategoryRequest, IncomeCategoryResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeCategoryService {
  private readonly API_URL = `${environment.apiUrl}/income-category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IncomeCategoryResponse[]> {
    return this.http.get<IncomeCategoryResponse[]>(this.API_URL);
  }

  getById(id: number): Observable<IncomeCategoryResponse> {
    return this.http.get<IncomeCategoryResponse>(`${this.API_URL}/${id}`);
  }

  create(category: IncomeCategoryRequest): Observable<IncomeCategoryResponse> {
    return this.http.post<IncomeCategoryResponse>(this.API_URL, category);
  }

  update(id: number, category: IncomeCategoryRequest): Observable<IncomeCategoryResponse> {
    return this.http.put<IncomeCategoryResponse>(`${this.API_URL}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
