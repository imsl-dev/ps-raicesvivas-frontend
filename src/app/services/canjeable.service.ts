import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NuevoCanjeableDTO } from "../models/dtos/canjeables/NuevoCanjeableDTO";
import { Observable } from "rxjs";
import { Canjeable } from "../models/entities/Canjeable";

@Injectable({
    providedIn: 'root'
})
export class CanjeableService {

    constructor(private http: HttpClient) { }

    private readonly API_URL = 'http://localhost:8080/api';

    postCanjeable(dto: NuevoCanjeableDTO): Observable<any> {
        return this.http.post(`${this.API_URL}/canjeables`, dto);
    }

    getAllCanjeables(): Observable<any> {
        return this.http.get(`${this.API_URL}/canjeables`);
    }

    // ⭐ NUEVO: Obtener TODOS los canjeables (admin)
    getAllCanjeablesAdmin(): Observable<any> {
        return this.http.get(`${this.API_URL}/canjeables/all`);
    }

    // ⭐ NUEVO: Obtener un canjeable por ID
    getCanjeableById(id: number): Observable<any> {
        return this.http.get(`${this.API_URL}/canjeables/${id}`);
    }

    // ⭐ NUEVO: Actualizar canjeable
    putCanjeable(id: number, dto: NuevoCanjeableDTO): Observable<any> {
        return this.http.put(`${this.API_URL}/canjeables/${id}`, dto);
    }

    // ⭐ NUEVO: Eliminar canjeable (soft delete)
    deleteCanjeable(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/canjeables/${id}`);
    }

    comprar(userId: number, canjeableId: number): Observable<any> {
        return this.http.post(`${this.API_URL}/canjeables/comprar/${userId}/${canjeableId}`, null);
    }

    canjear(userId: number, canjeableId: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/canjeables/canjear/${userId}/${canjeableId}`);
    }
}