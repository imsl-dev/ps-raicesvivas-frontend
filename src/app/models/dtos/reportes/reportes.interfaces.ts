// src/app/models/dtos/reportes/reportes.interfaces.ts

import { EstadoEvento, TipoEvento } from '../../enums/Enums';

export interface ReporteKPI {
    totalRecaudadoMes: number;
    inscripcionesMes: number;
    eventosActivos: number;
}

export interface ReporteGraficoTorta {
    labels: string[];
    values: number[];
}

export interface ReporteGraficoMensual {
    meses: string[];
    valores: number[];
}

export interface ReporteGraficoInscripcionesMensual {
    meses: string[];
    valores: number[];
}

export interface ReporteEvento {
    id: number;
    nombre: string;
    tipo: TipoEvento;
    horaInicio: string;
    ubicacion: string;
    estado: EstadoEvento;
    costoInscripcion: number;
    costoInterno: number;  // NUEVO
    totalInscripciones: number;
    sponsorNombre: string;  // NUEVO
}

export interface PageReporteEvento {
    content: ReporteEvento[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}