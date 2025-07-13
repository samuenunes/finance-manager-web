
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrlAdmin}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.loadUserFromToken(response.token);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token && this.isAuthenticated()) {
      this.loadUserFromToken(token);
    }
  }

  private loadUserFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        cpf: payload.cpf,
        role: payload.role
      };
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error parsing token:', error);
      this.logout();
    }
  }
}
