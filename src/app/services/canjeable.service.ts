import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NuevoCanjeableDTO } from "../models/dtos/canjeables/NuevoCanjeableDTO";

@Injectable({
    providedIn: 'root'
})
export class CanjeableService {

    constructor(private http: HttpClient) { }

    private readonly API_URL = 'http://localhost:8080/api';

    postCanjeable(dto: NuevoCanjeableDTO) {
        return this.http.post(`${this.API_URL}/canjeables`, dto)
    }

    getAllCanjeables() {
        return this.http.get(`${this.API_URL}/canjeables`)
    }

    comprar(userId: number, canjeableId: number) {
        return this.http.post(`${this.API_URL}/canjeables/comprar/${userId}/${canjeableId}`, null)
    }

    canjear(userId: number, canjeableId: number) {
        return this.http.delete(`${this.API_URL}/canjeables/canjear/${userId}/${canjeableId}`)
    }


}