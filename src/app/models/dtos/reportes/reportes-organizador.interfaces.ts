export interface ReporteOrganizadorKPI {
    totalEventosCreados: number;
    promedioAsistenciasPorEvento: number;
}

export interface ReporteTasaAsistencia {
    labels: string[];
    values: number[];
    totalInscripciones: number;
    porcentajeAsistencia: number;
}

export interface ReporteRecaudacionNetaEvento {
    nombresEventos: string[];
    recaudacionNeta: number[];
}

export interface ReporteDonacionOrganizador {
    donacionId: number;
    nombreEvento: string;
    fechaHora: string;
    nombreUsuario: string;
    montoDonado: number;
    mensaje: string;
}