// src/app/components/pages/panels/admin-panel/reportes-admin/reportes-admin.ts

import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ReporteService } from '../../../../../services/reporte.service';
import {
  ReporteKPI,
  ReporteGraficoTorta,
  ReporteGraficoMensual,
  ReporteGraficoInscripcionesMensual,
  ReporteEvento
} from '../../../../../models/dtos/reportes/reportes.interfaces';
import { TipoEvento, EstadoEvento } from '../../../../../models/enums/Enums';
import { TipoEventoPipe } from '../../../../../pipes/tipo-evento.pipe';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-reportes-admin',
  imports: [CommonModule, GoogleChartsModule, FormsModule, TipoEventoPipe],
  templateUrl: './reportes-admin.html',
  styleUrl: './reportes-admin.css'
})
export class ReportesAdmin implements OnInit {
  private readonly reporteService = inject(ReporteService);
  private readonly tipoEventoPipe = new TipoEventoPipe();

  @ViewChild('chartTorta') chartTorta!: ElementRef;
  @ViewChild('chartRecaudacion') chartRecaudacion!: ElementRef;
  @ViewChild('chartInscripciones') chartInscripciones!: ElementRef;

  loading: boolean = false;
  loadingTabla: boolean = false;
  exportandoExcel: boolean = false;

  // KPIs
  kpiData: ReporteKPI = {
    totalRecaudadoMes: 0,
    inscripcionesMes: 0,
    eventosActivos: 0
  };

  // Google Charts - Pie Chart (Tipos de eventos)
  pieChartType = ChartType.PieChart;
  pieChartData: any[] = [];
  pieChartOptions = {
    title: 'Tipos de Eventos Más Populares',
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    pieHole: 0.4,
    colors: ['#28a745', '#17a2b8', '#ffc107', '#dc3545'],
    legend: {
      position: 'bottom',
      textStyle: {
        fontSize: 14
      }
    },
    chartArea: {
      width: '90%',
      height: '75%'
    },
    backgroundColor: 'transparent',
    pieSliceText: 'percentage',
    pieSliceTextStyle: {
      fontSize: 14,
      bold: true
    }
  };
  pieChartWidth = 600;
  pieChartHeight = 400;

  // Google Charts - Bar Chart (Recaudación mensual)
  barChartType = ChartType.ColumnChart;
  barChartData: any[] = [];
  barChartOptions = {
    title: 'Recaudación Mensual 2025',
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    colors: ['#6f42c1'],
    legend: { position: 'none' },
    chartArea: {
      width: '85%',
      height: '70%'
    },
    backgroundColor: 'transparent',
    hAxis: {
      title: 'Mes',
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      title: 'Recaudación ($)',
      format: '$#,###',
      textStyle: {
        fontSize: 12
      }
    },
    bar: { groupWidth: '70%' }
  };
  barChartWidth = 800;
  barChartHeight = 400;

  // Google Charts - Line Chart (Inscripciones mensuales)
  lineChartType = ChartType.LineChart;
  lineChartData: any[] = [];
  lineChartOptions = {
    title: 'Inscripciones Mensuales 2025',
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    colors: ['#20c997'],
    legend: { position: 'none' },
    chartArea: {
      width: '85%',
      height: '70%'
    },
    backgroundColor: 'transparent',
    hAxis: {
      title: 'Mes',
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      title: 'Inscripciones',
      format: '#',
      textStyle: {
        fontSize: 12
      }
    },
    curveType: 'function',
    pointSize: 7
  };
  lineChartWidth = 800;
  lineChartHeight = 400;

  // Tabla de histórico de eventos
  eventos: ReporteEvento[] = [];

  // Filtros de tabla
  searchTerm: string = '';
  filtroTipo: string = 'TODOS';
  filtroGratuito: string = 'TODOS';
  tiposEvento = Object.values(TipoEvento).sort((a, b) => a.localeCompare(b));

  // Paginación
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.loadReportes();
    this.loadHistoricoEventos();
  }

  loadReportes(): void {
    this.loading = true;

    this.reporteService.obtenerKPIs().subscribe({
      next: (data) => {
        this.kpiData = data;
      },
      error: (err) => {
        console.error('Error cargando KPIs:', err);
      }
    });

    this.reporteService.obtenerTiposEventosPopulares().subscribe({
      next: (data) => {
        this.pieChartData = this.convertirPieChartData(data);
      },
      error: (err) => {
        console.error('Error cargando tipos de eventos:', err);
      }
    });

    this.reporteService.obtenerRecaudacionMensual().subscribe({
      next: (data) => {
        this.barChartData = this.convertirBarChartData(data);
      },
      error: (err) => {
        console.error('Error cargando recaudación mensual:', err);
      }
    });

    this.reporteService.obtenerInscripcionesMensuales().subscribe({
      next: (data) => {
        this.lineChartData = this.convertirLineChartData(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando inscripciones mensuales:', err);
        this.loading = false;
      }
    });
  }

  loadHistoricoEventos(): void {
    this.loadingTabla = true;

    const tipo = this.filtroTipo === 'TODOS' ? undefined : (this.filtroTipo as TipoEvento);
    const esGratuito = this.filtroGratuito === 'TODOS' ? undefined : this.filtroGratuito === 'SI';

    this.reporteService.obtenerHistoricoEventos(
      this.searchTerm || undefined,
      tipo,
      esGratuito,
      this.currentPage,
      this.itemsPerPage,
      'horaInicio',
      'DESC'
    ).subscribe({
      next: (data) => {
        this.eventos = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loadingTabla = false;
      },
      error: (err) => {
        console.error('Error cargando histórico de eventos:', err);
        this.loadingTabla = false;
      }
    });
  }

  // Convertir datos para Google Charts
  convertirPieChartData(data: ReporteGraficoTorta): any[] {
    const chartData: any[] = [];
    for (let i = 0; i < data.labels.length; i++) {
      // Cast a TipoEvento y aplicar el pipe
      const labelFormateado = this.tipoEventoPipe.transform(data.labels[i] as TipoEvento);
      chartData.push([labelFormateado, data.values[i]]);
    }
    return chartData;
  }

  convertirBarChartData(data: ReporteGraficoMensual): any[] {
    const chartData: any[] = [];
    for (let i = 0; i < data.meses.length; i++) {
      chartData.push([data.meses[i], data.valores[i]]);
    }
    return chartData;
  }

  convertirLineChartData(data: ReporteGraficoInscripcionesMensual): any[] {
    const chartData: any[] = [];
    for (let i = 0; i < data.meses.length; i++) {
      chartData.push([data.meses[i], data.valores[i]]);
    }
    return chartData;
  }

  // NUEVOS MÉTODOS DE EXPORTACIÓN

  async exportarGraficoAPDF(element: ElementRef, nombreArchivo: string): Promise<void> {
    try {
      const canvas = await html2canvas(element.nativeElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      const fecha = new Date().toISOString().split('T')[0];
      pdf.save(`${nombreArchivo}_${fecha}.pdf`);
    } catch (error) {
      console.error('Error exportando gráfico a PDF:', error);
    }
  }

  exportarTortaAPDF(): void {
    this.exportarGraficoAPDF(this.chartTorta, 'tipos_eventos');
  }

  exportarRecaudacionAPDF(): void {
    this.exportarGraficoAPDF(this.chartRecaudacion, 'recaudacion_mensual');
  }

  exportarInscripcionesAPDF(): void {
    this.exportarGraficoAPDF(this.chartInscripciones, 'inscripciones_mensuales');
  }

  exportarTablaAExcel(): void {
    this.exportandoExcel = true;

    const tipo = this.filtroTipo === 'TODOS' ? undefined : (this.filtroTipo as TipoEvento);
    const esGratuito = this.filtroGratuito === 'TODOS' ? undefined : this.filtroGratuito === 'SI';

    this.reporteService.obtenerHistoricoEventosParaExportar(
      this.searchTerm || undefined,
      tipo,
      esGratuito
    ).subscribe({
      next: (eventos) => {
        // Preparar datos para Excel con tipos formateados
        const datosExcel = eventos.map(evento => ({
          'Nombre': evento.nombre,
          'Tipo': this.tipoEventoPipe.transform(evento.tipo), // FORMATEADO
          'Fecha': this.formatearFecha(evento.horaInicio),
          'Ubicación': evento.ubicacion,
          'Estado': evento.estado,
          'Costo Inscripción': evento.costoInscripcion,
          'Costo Interno': evento.costoInterno,
          'Sponsor': evento.sponsorNombre,
          'Inscripciones': evento.totalInscripciones
        }));

        // Crear workbook y worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Eventos');

        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 30 }, // Nombre
          { wch: 25 }, // Tipo (aumentado para "Recolección de basura")
          { wch: 20 }, // Fecha
          { wch: 30 }, // Ubicación
          { wch: 15 }, // Estado
          { wch: 18 }, // Costo Inscripción
          { wch: 18 }, // Costo Interno
          { wch: 25 }, // Sponsor
          { wch: 15 }  // Inscripciones
        ];
        ws['!cols'] = colWidths;

        // Guardar archivo
        const fecha = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `historico_eventos_${fecha}.xlsx`);

        this.exportandoExcel = false;
      },
      error: (err) => {
        console.error('Error exportando tabla a Excel:', err);
        this.exportandoExcel = false;
      }
    });
  }

  // Filtros y paginación de tabla
  aplicarFiltros(): void {
    this.currentPage = 0;
    this.loadHistoricoEventos();
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroTipo = 'TODOS';
    this.filtroGratuito = 'TODOS';
    this.currentPage = 0;
    this.loadHistoricoEventos();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadHistoricoEventos();
    }
  }

  // Helpers
  getEstadoBadgeClass(estado: EstadoEvento): string {
    switch (estado) {
      case EstadoEvento.PROXIMO:
        return 'badge-primary';
      case EstadoEvento.EN_CURSO:
        return 'badge-success';
      case EstadoEvento.FINALIZADO:
        return 'badge-secondary';
      case EstadoEvento.CANCELADO:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  esGratuito(costo: number): boolean {
    return costo === 0;
  }
}