import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../models/entities/Usuario';
import { RolUsuario, TipoDocumento } from '../models/enums/Enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  private mockUsuario: Usuario = {
    id: 1,
    nombre: "Nombre mockeado",
    apellido: "Apellido mockeado",
    tipoDocumento: TipoDocumento.DNI,
    nroDocumento: "12345678",
    rol: RolUsuario.USUARIO,
    email: "email@asd.com",
    canjeables: []
  };

  // Initialize from localStorage if available
  private storedUser = this.getStoredUser();
  private authState = new BehaviorSubject<boolean>(!!this.storedUser);
  private userState = new BehaviorSubject<Usuario>(this.storedUser || this.mockUsuario);

  isAuthenticated$ = this.authState.asObservable();
  usuario = this.userState.asObservable();

  constructor(private http: HttpClient) { }

  /** 🔑 Login: call backend and store role + user in localStorage */
  login(email: string, password: string) {
    return this.http.get<Usuario>(`${this.API_URL}/auth/login?email=${email}&password=${password}`).pipe(
      tap(response => {
        if (response.rol) {
          // Save user info in localStorage
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('role', response.rol);
          localStorage.setItem('email', email);

          // Update subjects
          this.userState.next(response);
          this.authState.next(true);
        }
      })
    );
  }

  /** 🚪 Logout: clear localStorage + update state */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.authState.next(false);
    this.userState.next(this.mockUsuario);
  }

  /** 📦 Utility: read stored user */
  private getStoredUser(): Usuario | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  /** 🛡️ Getter for role */
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/usuarios`, userData);
  }

  verificarEmailEnUso() {
    return this.http.get<boolean>(`${this.API_URL}/auth/email/disponible`);
  }

  obtenerUsuarioLogueado(): Observable<Usuario> {
    return this.usuario;
  }
}
