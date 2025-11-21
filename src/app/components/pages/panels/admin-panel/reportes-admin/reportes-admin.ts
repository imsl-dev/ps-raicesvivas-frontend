import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

interface KPIData {
  totalRecaudado: number;
  inscripcionesMes: number;
  eventosActivos: number;
  usuariosActivos: number;
}

interface EventTypeData {
  tipo: string;
  cantidad: number;
}

@Component({
  selector: 'app-reportes-admin',
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './reportes-admin.html',
  styleUrl: './reportes-admin.css'
})
export class ReportesAdmin implements OnInit {
  loading: boolean = false;

  // KPIs
  kpiData: KPIData = {
    totalRecaudado: 0,
    inscripcionesMes: 0,
    eventosActivos: 0,
    usuariosActivos: 0
  };

  // Google Charts - Pie Chart
  pieChartType = ChartType.PieChart;
  pieChartData: any[] = [];
  pieChartOptions = {
    title: 'Tipos de Eventos Más Populares',
    titleTextStyle: {
      fontSize: 18,
      bold: true,
      color: '#2c3e50'
    },
    pieHole: 0.4, // Donut chart
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

  // Google Charts - Bar Chart (Recaudación por mes)
  barChartType = ChartType.ColumnChart;
  barChartData: any[] = [];
  barChartOptions = {
    title: 'Recaudación Mensual',
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

  // Google Charts - Line Chart (Inscripciones por mes)
  lineChartType = ChartType.LineChart;
  lineChartData: any[] = [];
  lineChartOptions = {
    title: 'Inscripciones Mensuales',
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

  ngOnInit(): void {
    this.loadReportes();
  }

  loadReportes(): void {
    this.loading = true;

    // TODO: Replace with actual API calls
    // this.reportesService.getKPIs().subscribe({...});
    // this.reportesService.getEventTypes().subscribe({...});
    // this.reportesService.getRecaudacionMensual().subscribe({...});
    // this.reportesService.getInscripcionesMensuales().subscribe({...});

    // Mock data
    setTimeout(() => {
      this.loadKPIData();
      this.loadPieChartData();
      this.loadBarChartData();
      this.loadLineChartData();
      this.loading = false;
    }, 500);
  }

  loadKPIData(): void {
    // Mock KPI data
    this.kpiData = {
      totalRecaudado: 145800,
      inscripcionesMes: 342,
      eventosActivos: 28,
      usuariosActivos: 1247
    };
  }

  loadPieChartData(): void {
    // Mock pie chart data - Event types
    const eventTypes: EventTypeData[] = [
      { tipo: 'Reforestación', cantidad: 45 },
      { tipo: 'Recolección de Basura', cantidad: 38 },
      { tipo: 'Junta de Alimentos', cantidad: 28 },
      { tipo: 'Donaciones', cantidad: 22 }
    ];

    this.pieChartData = eventTypes.map(item => [item.tipo, item.cantidad]);
  }

  loadBarChartData(): void {
    // Mock bar chart data - Monthly revenue
    const monthlyRevenue = [
      ['Enero', 12500],
      ['Febrero', 15800],
      ['Marzo', 18200],
      ['Abril', 16500],
      ['Mayo', 19800],
      ['Junio', 21200],
      ['Julio', 17600],
      ['Agosto', 20100],
      ['Septiembre', 22400],
      ['Octubre', 19900],
      ['Noviembre', 23500],
      ['Diciembre', 18300]
    ];

    this.barChartData = monthlyRevenue;
  }

  loadLineChartData(): void {
    // Mock line chart data - Monthly registrations
    const monthlyRegistrations = [
      ['Enero', 245],
      ['Febrero', 298],
      ['Marzo', 312],
      ['Abril', 289],
      ['Mayo', 356],
      ['Junio', 378],
      ['Julio', 324],
      ['Agosto', 401],
      ['Septiembre', 389],
      ['Octubre', 412],
      ['Noviembre', 445],
      ['Diciembre', 342]
    ];

    this.lineChartData = monthlyRegistrations;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-AR').format(value);
  }
}