import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    ReporteOrganizadorKPI,
    ReporteTasaAsistencia,
    ReporteRecaudacionNetaEvento,
    ReporteDonacionOrganizador
} from '../models/dtos/reportes/reportes-organizador.interfaces';
import { PageReporteEvento, ReporteEvento } from '../models/dtos/reportes/reportes.interfaces';
import { TipoEvento } from '../models/enums/Enums';

@Injectable({
    providedIn: 'root'
})
export class ReporteOrganizadorService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `http://localhost:8080/api/reportes/organizador`;

    obtenerKPIs(organizadorId: number): Observable<ReporteOrganizadorKPI> {
        return this.http.get<ReporteOrganizadorKPI>(`${this.baseUrl}/${organizadorId}/kpis`);
    }

    obtenerTasaAsistencia(organizadorId: number): Observable<ReporteTasaAsistencia> {
        return this.http.get<ReporteTasaAsistencia>(`${this.baseUrl}/${organizadorId}/tasa-asistencia`);
    }

    obtenerRecaudacionNeta(organizadorId: number): Observable<ReporteRecaudacionNetaEvento> {
        return this.http.get<ReporteRecaudacionNetaEvento>(`${this.baseUrl}/${organizadorId}/recaudacion-neta`);
    }

    obtenerDonaciones(organizadorId: number): Observable<ReporteDonacionOrganizador[]> {
        return this.http.get<ReporteDonacionOrganizador[]>(`${this.baseUrl}/${organizadorId}/donaciones`);
    }

    obtenerHistoricoEventos(
        organizadorId: number,
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

        return this.http.get<PageReporteEvento>(`${this.baseUrl}/${organizadorId}/historico-eventos`, { params });
    }

    obtenerHistoricoEventosParaExportar(
        organizadorId: number,
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

        return this.http.get<ReporteEvento[]>(`${this.baseUrl}/${organizadorId}/historico-eventos/exportar`, { params });
    }
}