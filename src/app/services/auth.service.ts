// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.hasStoredAuth());
  isAuthenticated$ = this.authState.asObservable();
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  /** 🔑 Login: call backend and store role in localStorage */
  login(email: string, password: string) {
    console.log("[LOGIN] Intentando Login con Email: " + email, +" Password: " + password);
    return this.http.get<string>(`${this.API_URL}/auth/login?email=${email}&password=${password}`).pipe(
      tap(role => {
        if (role) {
          localStorage.setItem('role', role);
          localStorage.setItem('email', email);
          this.authState.next(true);
        }
      })
    );
  }

  /** 🚪 Logout: clear localStorage + update state */
  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.authState.next(false);
  }

  /** 📦 Utility: check initial auth state */
  private hasStoredAuth(): boolean {
    return !!localStorage.getItem('role');
  }

  /** 🛡️ Getter for role */
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/usuarios`, userData);
  }

  verificarEmailEnUso() {
    return this.http.get<boolean>(`${this.API_URL}/auth/email/disponible`)
  }
}
