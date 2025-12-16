// src/app/components/pages/panels/panel-organizador/reportes-organizador/reportes-organizador.ts

import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ReporteOrganizadorService } from '../../../../../services/reporte-organizador.service';
import { AuthService } from '../../../../../services/auth.service';
import {
  ReporteOrganizadorKPI,
  ReporteTasaAsistencia,
  ReporteRecaudacionNetaEvento,
  ReporteDonacionOrganizador
} from '../../../../../models/dtos/reportes/reportes-organizador.interfaces';
import { ReporteEvento } from '../../../../../models/dtos/reportes/reportes.interfaces';
import { TipoEvento, EstadoEvento } from '../../../../../models/enums/Enums';
import { TipoEventoPipe } from '../../../../../pipes/tipo-evento.pipe';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes-organizador',
  imports: [CommonModule, GoogleChartsModule, FormsModule, TipoEventoPipe],
  templateUrl: './reportes-organizador.html',
  styleUrl: './reportes-organizador.css'
})
export class ReportesOrganizador implements OnInit {
  private readonly reporteService = inject(ReporteOrganizadorService);
  private readonly authService = inject(AuthService);
  private readonly tipoEventoPipe = new TipoEventoPipe();

  @ViewChild('chartTorta') chartTorta!: ElementRef;
  @ViewChild('chartRecaudacion') chartRecaudacion!: ElementRef;

  organizadorId: number | null = null;
  loading: boolean = false;
  loadingTabla: boolean = false;
  loadingDonaciones: boolean = false;
  exportandoExcel: boolean = false;

  // KPIs
  kpiData: ReporteOrganizadorKPI = {
    totalEventosCreados: 0,
    promedioAsistenciasPorEvento: 0
  };

  // Tasa de asistencia
  tasaAsistenciaData: ReporteTasaAsistencia = {
    labels: [],
    values: [],
    totalInscripciones: 0,
    porcentajeAsistencia: 0
  };

  // Google Charts - Pie Chart (Tasa de Asistencia)
  pieChartType = ChartType.PieChart;
  pieChartData: any[] = [];
  pieChartOptions = {
    title: 'Tasa de Asistencia (Eventos Finalizados)',
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    pieHole: 0.4,
    colors: ['#28a745', '#dc3545'],
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
  pieChartWidth = 500;
  pieChartHeight = 400;

  // Google Charts - Bar Chart (Recaudación Neta por Evento)
  barChartType = ChartType.ColumnChart;
  barChartData: any[] = [];
  barChartOptions = {
    title: 'Recaudación Neta por Evento (Donaciones - Costo Interno)',
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
      title: 'Evento',
      textStyle: {
        fontSize: 11
      },
      slantedText: true,
      slantedTextAngle: 30
    },
    vAxis: {
      title: 'Recaudación Neta ($)',
      format: '$#,###',
      textStyle: {
        fontSize: 12
      }
    },
    bar: { groupWidth: '70%' }
  };
  barChartWidth = 800;
  barChartHeight = 400;

  // Tabla de donaciones
  donaciones: ReporteDonacionOrganizador[] = [];

  // Tabla de histórico de eventos
  eventos: ReporteEvento[] = [];

  // Filtros de tabla eventos
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
    this.loadUsuarioYReportes();
  }

  loadUsuarioYReportes(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (usuario) => {
        if (usuario && usuario.id) {
          this.organizadorId = usuario.id;
          this.loadReportes();
          this.loadDonaciones();
          this.loadHistoricoEventos();
        }
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
      }
    });
  }

  loadReportes(): void {
    if (!this.organizadorId) return;

    this.loading = true;

    this.reporteService.obtenerKPIs(this.organizadorId).subscribe({
      next: (data) => {
        this.kpiData = data;
      },
      error: (err) => {
        console.error('Error cargando KPIs:', err);
      }
    });

    this.reporteService.obtenerTasaAsistencia(this.organizadorId).subscribe({
      next: (data) => {
        this.tasaAsistenciaData = data;
        this.pieChartData = this.convertirPieChartData(data);
      },
      error: (err) => {
        console.error('Error cargando tasa de asistencia:', err);
      }
    });

    this.reporteService.obtenerRecaudacionNeta(this.organizadorId).subscribe({
      next: (data) => {
        this.barChartData = this.convertirBarChartData(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando recaudación neta:', err);
        this.loading = false;
      }
    });
  }

  loadDonaciones(): void {
    if (!this.organizadorId) return;

    this.loadingDonaciones = true;

    this.reporteService.obtenerDonaciones(this.organizadorId).subscribe({
      next: (data) => {
        this.donaciones = data;
        this.loadingDonaciones = false;
      },
      error: (err) => {
        console.error('Error cargando donaciones:', err);
        this.loadingDonaciones = false;
      }
    });
  }

  loadHistoricoEventos(): void {
    if (!this.organizadorId) return;

    this.loadingTabla = true;

    const tipo = this.filtroTipo === 'TODOS' ? undefined : (this.filtroTipo as TipoEvento);
    const esGratuito = this.filtroGratuito === 'TODOS' ? undefined : this.filtroGratuito === 'SI';

    this.reporteService.obtenerHistoricoEventos(
      this.organizadorId,
      this.searchTerm,
      tipo,
      esGratuito,
      this.currentPage,
      this.itemsPerPage
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

  // Conversión de datos para gráficos
  convertirPieChartData(data: ReporteTasaAsistencia): any[] {
    if (!data.labels || data.labels.length === 0) {
      return [];
    }
    return data.labels.map((label, index) => [label, data.values[index]]);
  }

  convertirBarChartData(data: ReporteRecaudacionNetaEvento): any[] {
    if (!data.nombresEventos || data.nombresEventos.length === 0) {
      return [];
    }
    return data.nombresEventos.map((nombre, index) => {
      // Truncar nombre si es muy largo
      const nombreCorto = nombre.length > 25 ? nombre.substring(0, 22) + '...' : nombre;
      return [nombreCorto, Number(data.recaudacionNeta[index])];
    });
  }

  // Filtros y paginación
  onFiltroChange(): void {
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

  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.currentPage = pagina;
      this.loadHistoricoEventos();
    }
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5;
    let inicio = Math.max(0, this.currentPage - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPages, inicio + maxPaginas);

    if (fin - inicio < maxPaginas) {
      inicio = Math.max(0, fin - maxPaginas);
    }

    for (let i = inicio; i < fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  // Helpers
  getEstadoClass(estado: EstadoEvento): string {
    switch (estado) {
      case EstadoEvento.PROXIMO: return 'estado-proximo';
      case EstadoEvento.EN_CURSO: return 'estado-en-curso';
      case EstadoEvento.FINALIZADO: return 'estado-finalizado';
      case EstadoEvento.CANCELADO: return 'estado-cancelado';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Exportaciones
  async exportarTortaAPDF(): Promise<void> {
    if (!this.chartTorta) return;

    try {
      const canvas = await html2canvas(this.chartTorta.nativeElement, {
        ignoreElements: (el) => el.classList.contains('btn-export')
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(16);
      pdf.text('Tasa de Asistencia - Mis Eventos', 15, 15);
      pdf.setFontSize(10);
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 15, 22);
      pdf.text(`Total inscripciones: ${this.tasaAsistenciaData.totalInscripciones}`, 15, 28);
      pdf.text(`Porcentaje asistencia: ${this.tasaAsistenciaData.porcentajeAsistencia}%`, 15, 34);

      pdf.addImage(imgData, 'PNG', 15, 40, imgWidth, imgHeight);
      pdf.save('tasa-asistencia-organizador.pdf');
    } catch (error) {
      console.error('Error exportando PDF:', error);
    }
  }

  async exportarRecaudacionAPDF(): Promise<void> {
    if (!this.chartRecaudacion) return;

    try {
      const canvas = await html2canvas(this.chartRecaudacion.nativeElement, {
        ignoreElements: (el) => el.classList.contains('btn-export')
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(16);
      pdf.text('Recaudación Neta por Evento', 15, 15);
      pdf.setFontSize(10);
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 15, 22);

      pdf.addImage(imgData, 'PNG', 15, 30, imgWidth, imgHeight);
      pdf.save('recaudacion-neta-organizador.pdf');
    } catch (error) {
      console.error('Error exportando PDF:', error);
    }
  }

  exportarDonacionesAExcel(): void {
    if (this.donaciones.length === 0) return;

    const datosExcel = this.donaciones.map(d => ({
      'Evento': d.nombreEvento,
      'Fecha/Hora': this.formatDate(d.fechaHora),
      'Usuario': d.nombreUsuario,
      'Monto Donado': `$${d.montoDonado.toFixed(2)}`,
      'Mensaje': d.mensaje || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Donaciones');
    XLSX.writeFile(wb, 'donaciones-mis-eventos.xlsx');
  }

  exportarEventosAExcel(): void {
    if (!this.organizadorId) return;

    this.exportandoExcel = true;

    const tipo = this.filtroTipo === 'TODOS' ? undefined : (this.filtroTipo as TipoEvento);
    const esGratuito = this.filtroGratuito === 'TODOS' ? undefined : this.filtroGratuito === 'SI';

    this.reporteService.obtenerHistoricoEventosParaExportar(
      this.organizadorId,
      this.searchTerm,
      tipo,
      esGratuito
    ).subscribe({
      next: (eventos) => {
        const datosExcel = eventos.map(e => ({
          'ID': e.id,
          'Nombre': e.nombre,
          'Tipo': this.tipoEventoPipe.transform(e.tipo),
          'Fecha Inicio': this.formatDateShort(e.horaInicio),
          'Ubicación': e.ubicacion,
          'Estado': e.estado,
          'Costo Inscripción': e.costoInscripcion ? `$${e.costoInscripcion}` : 'Gratis',
          'Costo Interno': e.costoInterno ? `$${e.costoInterno}` : '$0',
          'Inscripciones': e.totalInscripciones,
          'Sponsor': e.sponsorNombre
        }));

        const ws = XLSX.utils.json_to_sheet(datosExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Mis Eventos');
        XLSX.writeFile(wb, 'historico-mis-eventos.xlsx');
        this.exportandoExcel = false;
      },
      error: (err) => {
        console.error('Error exportando eventos:', err);
        this.exportandoExcel = false;
      }
    });
  }
}