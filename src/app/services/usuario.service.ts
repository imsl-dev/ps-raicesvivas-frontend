import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/entities/Usuario';
import { ActualizarRolDTO } from '../components/pages/panels/admin-panel/gestion-roles/gestion-roles';
import { RolUsuario } from '../models/enums/Enums';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private readonly API_URL = 'http://localhost:8080/api';

  getAll() {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios/todos`)
  }

  cambiarRol(idUsuario: number, nuevoRol: RolUsuario) {
    return this.http.patch<boolean>(`${this.API_URL}/usuarios/rol/cambiar`, { idUsuario: idUsuario, nuevoRol: nuevoRol })
  }
}
