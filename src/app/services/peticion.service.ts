import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeticionOrganizadorPostDTO } from '../models/dtos/peticionesOrganizador/PeticionOrganizadorPostDTO';
import { PeticionOrganizador } from '../models/entities/PeticionOrganizador';


@Injectable({
  providedIn: 'root'
})
export class PeticionService {
  constructor(private http: HttpClient) { }

  private readonly API_URL = 'http://localhost:8080/api';

  getPeticionByUserId(id: number) {
    return this.http.get<PeticionOrganizador>(`${this.API_URL}/peticiones/${id}`)
  }

  postPeticion(peticion: PeticionOrganizadorPostDTO) {
    return this.http.post<PeticionOrganizador>(`${this.API_URL}/peticiones`, peticion)
  }
}
