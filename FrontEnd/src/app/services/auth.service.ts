import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient)
  private apiUrl = "https://e46b099ae061.ngrok-free.app/api/auth"
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  // login(email: string, password: string): Observable<AuthResponse> {
  //   // Mock authentication - in real app, this would call an API
  //   const mockUser: User = {
  //     id: '1',
  //     email: email,
  //     name: email.split('@')[0],
  //     points: 150,
  //     isAdmin: email.includes('admin'),
  //     createdAt: new Date(),
  //     profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  //   };

  //   const response: AuthResponse = {
  //     user: mockUser,
  //     token: 'mock-jwt-token'
  //   };

  //   localStorage.setItem('currentUser', JSON.stringify(mockUser));
  //   localStorage.setItem('token', response.token);
  //   this.currentUserSubject.next(mockUser);

  //   return of(response);
  // }

  login(email: string, password: string): Observable<AuthResponse> {
  const payload = { email, password };

  return new Observable(observer => {
    this.httpClient.post<AuthResponse>(`${this.apiUrl}/login/`, payload).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
        observer.next(response);
        observer.complete();
      },
      error: (error) => {
        console.log(error);
        
        observer.error(error);
      }
    });
  });
}

  // register(email: string, password: string, name: string): Observable<AuthResponse> {
  //    const payload = { email, password, name };
  //   // Mock registration
  //   return this.httpClient.post(`${this.apiUrl}/register`, payload)
  //   const mockUser: User = {
  //     id: Date.now().toString(),
  //     email: email,
  //     name: name,
  //     points: 100,
  //     isAdmin: false,
  //     createdAt: new Date()
  //   };


  //   const response: AuthResponse = {
  //     user: mockUser,
  //     token: 'mock-jwt-token'
  //   };

  //   localStorage.setItem('currentUser', JSON.stringify(mockUser));
  //   localStorage.setItem('token', response.token);
  //   this.currentUserSubject.next(mockUser);

  //   return of(response);
  // }
  register(email: string, password: string, name: string): Observable<any> {
    const payload: any = {name,email,password};
    console.log(payload);
    
    return this.httpClient.post(`${this.apiUrl}/register/`, payload);
    // https://e46b099ae061.ngrok-free.app/api/auth/register/
    
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false;
  }

  updatePoints(points: number): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, points };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
} 