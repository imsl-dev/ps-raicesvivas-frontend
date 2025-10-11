// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../models/entities/Usuario';
import { RolUsuario, TipoDocumento } from '../models/enums/Enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.hasStoredAuth());

  private mockUsuario: Usuario = {
    id: 1,
    nombre: "Nombre mockeado",
    apellido: "Apellido mockeado",
    tipoDocumento: TipoDocumento.DNI,
    nroDocumento: "12345678",
    rol: RolUsuario.USUARIO

  }

  private userState = new BehaviorSubject<Usuario>(this.mockUsuario)
  isAuthenticated$ = this.authState.asObservable();
  usuario = this.userState.asObservable()
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  /** 🔑 Login: call backend and store role in localStorage */
  login(email: string, password: string) {
    console.log("[LOGIN] Intentando Login con Email: " + email, +" Password: " + password);
    return this.http.get<Usuario>(`${this.API_URL}/auth/login?email=${email}&password=${password}`).pipe(
      tap(response => {
        if (response.rol) {
          localStorage.setItem('role', response.rol);
          localStorage.setItem('email', email);
          this.userState.next(response)
          this.authState.next(true);


          let usuarioLogueado;
          this.obtenerUsuarioLogueado().subscribe((usuario) => { usuarioLogueado = usuario })

          console.log(usuarioLogueado);
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

  obtenerUsuarioLogueado(): Observable<Usuario> {
    return this.usuario
  }
}
