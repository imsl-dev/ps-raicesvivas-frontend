import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../models/entities/Evento";

@Injectable({
    providedIn: 'root'
})
export class EventoService {
    constructor() { }
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:8080/api/eventos';

    getEventos(): Observable<Evento[]> {
        return this.http.get<Evento[]>(this.API_URL);
    }

    getEventosOrganizador(idOrganizador: number): Observable<Evento[]> {
        return this.http.get<Evento[]>(`${this.API_URL}/organizador/${idOrganizador}`);
    }

    getEventoById(id: number): Observable<Evento> {
        return this.http.get<Evento>(`${this.API_URL}/${id}`);
    }

    postEvento(evento: Evento): Observable<Evento> {
        return this.http.post<Evento>(this.API_URL, evento);
    }

    putEvento(evento: Evento): Observable<Evento> {
        return this.http.put<Evento>(`${this.API_URL}/${evento.id}`, evento);
    }

    deleteEvento(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}