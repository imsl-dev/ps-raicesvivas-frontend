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

    validarInscripcion(usuarioId: number, eventoId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.API_URL}/validarInscripcion`, {
            params: { usuarioId: usuarioId.toString(), eventoId: eventoId.toString() }
        });
    }

    inscribirseEvento(usuarioId: number, eventoId: number): Observable<any> {
        return this.http.post(`${this.API_URL}/inscribirse`, null, {
            params: { usuarioId: usuarioId.toString(), eventoId: eventoId.toString() }
        });
    }

    cancelarInscripcion(usuarioId: number, eventoId: number): Observable<any> {
        return this.http.put(`${this.API_URL}`, null, {
            params: {
                usuarioId: usuarioId.toString(),
                eventoId: eventoId.toString(),
                estado: 'CANCELADO'
            }
        });
    }
}