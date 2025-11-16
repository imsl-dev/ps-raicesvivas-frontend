import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonacionService } from '../../../services/donacion.service';
import { PagoResponse } from '../../../models/dtos/pagos/PagoResponse';

interface DonacionConPosicion extends PagoResponse {
  posicionX: number;
  posicionY: number;
  rotacion: number;
  tamano: number;
}

@Component({
  selector: 'app-mural-donaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mural-donaciones.html',
  styleUrl: './mural-donaciones.css'
})
export class MuralDonaciones implements OnInit {
  private readonly donacionService = inject(DonacionService);

  donaciones: DonacionConPosicion[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarDonaciones();
  }

  cargarDonaciones(): void {
    this.loading = true;
    this.error = null;

    this.donacionService.obtenerUltimasDonaciones().subscribe({
      next: (data) => {
        const posicionesX = [5, 37, 70];   // 3 columnas centradas y separadas
        const posicionesY = [0, 27, 53, 80]; // 4 filas separadas

        this.donaciones = data.map((donacion, index) => {
          const columnas = 3;

          const columna = index % columnas;
          const fila = Math.floor(index / columnas);

          return {
            ...donacion,
            posicionX: posicionesX[columna],
            posicionY: posicionesY[fila],
            rotacion: this.randomRange(-8, 8),
            tamano: this.randomRange(0.9, 1.1)
          };
        });


        this.loading = false;
        console.log(this.donaciones);
      },
      error: (err) => {
        console.error('Error al cargar donaciones:', err);
        this.error = 'No se pudieron cargar las donaciones';
        this.loading = false;
      }
    });
  }

  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
      return 'Hoy';
    } else if (diffDias === 1) {
      return 'Ayer';
    } else if (diffDias < 7) {
      return `Hace ${diffDias} días`;
    } else if (diffDias < 30) {
      const semanas = Math.floor(diffDias / 7);
      return semanas === 1 ? 'Hace 1 semana' : `Hace ${semanas} semanas`;
    } else {
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  formatearMonto(monto: number): string {
    return `$${monto.toLocaleString('es-AR')}`;
  }
}