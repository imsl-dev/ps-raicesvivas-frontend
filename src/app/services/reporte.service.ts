// src/app/services/reporte.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    ReporteKPI,
    ReporteGraficoTorta,
    ReporteGraficoMensual,
    ReporteGraficoInscripcionesMensual,
    PageReporteEvento,
    ReporteEvento
} from '../models/dtos/reportes/reportes.interfaces';
import { TipoEvento } from '../models/enums/Enums';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `http://localhost:8080/api/reportes`;

    obtenerKPIs(): Observable<ReporteKPI> {
        return this.http.get<ReporteKPI>(`${this.baseUrl}/kpis`);
    }

    obtenerTiposEventosPopulares(): Observable<ReporteGraficoTorta> {
        return this.http.get<ReporteGraficoTorta>(`${this.baseUrl}/tipos-eventos-populares`);
    }

    obtenerRecaudacionMensual(): Observable<ReporteGraficoMensual> {
        return this.http.get<ReporteGraficoMensual>(`${this.baseUrl}/recaudacion-mensual`);
    }

    obtenerInscripcionesMensuales(): Observable<ReporteGraficoInscripcionesMensual> {
        return this.http.get<ReporteGraficoInscripcionesMensual>(`${this.baseUrl}/inscripciones-mensuales`);
    }

    obtenerHistoricoEventos(
        nombre?: string,
        tipo?: TipoEvento,
        esGratuito?: boolean,
        page: number = 0,
        size: number = 10,
        sort: string = 'horaInicio',
        direction: string = 'DESC'
    ): Observable<PageReporteEvento> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort)
            .set('direction', direction);

        if (nombre && nombre.trim()) {
            params = params.set('nombre', nombre.trim());
        }

        if (tipo) {
            params = params.set('tipo', tipo);
        }

        if (esGratuito !== undefined && esGratuito !== null) {
            params = params.set('esGratuito', esGratuito.toString());
        }

        return this.http.get<PageReporteEvento>(`${this.baseUrl}/historico-eventos`, { params });
    }

    // NUEVO: Método para obtener todos los eventos para exportar
    obtenerHistoricoEventosParaExportar(
        nombre?: string,
        tipo?: TipoEvento,
        esGratuito?: boolean
    ): Observable<ReporteEvento[]> {
        let params = new HttpParams();

        if (nombre && nombre.trim()) {
            params = params.set('nombre', nombre.trim());
        }

        if (tipo) {
            params = params.set('tipo', tipo);
        }

        if (esGratuito !== undefined && esGratuito !== null) {
            params = params.set('esGratuito', esGratuito.toString());
        }

        return this.http.get<ReporteEvento[]>(`${this.baseUrl}/historico-eventos/exportar`, { params });
    }
}