import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../../services/pago.service';
import { PagoResponse } from '../../../../models/dtos/pagos/PagoResponse';

@Component({
  selector: 'app-pago-failure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-failure.html',
  styleUrl: './pago-failure.css'
})
export class PagoFailure implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pagoService = inject(PagoService);

  pagoId: number | null = null;
  pago: PagoResponse | null = null;
  loading = true;

  ngOnInit(): void {
    const pagoIdParam = this.route.snapshot.queryParamMap.get('pagoId');
    if (pagoIdParam) {
      this.pagoId = Number(pagoIdParam);
      this.cargarPago(this.pagoId);
    } else {
      this.loading = false;
    }
  }

  cargarPago(pagoId: number): void {
    this.pagoService.obtenerPago(pagoId).subscribe({
      next: (pago) => {
        this.pago = pago;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el pago:', err);
        this.loading = false;
      }
    });
  }

  reintentar(): void {
    if (this.pago?.eventoId) {
      this.router.navigate(['/eventos', this.pago.eventoId]);
    } else {
      this.router.navigate(['/eventos']);
    }
  }

  volverAEventos(): void {
    this.router.navigate(['/eventos']);
  }
}