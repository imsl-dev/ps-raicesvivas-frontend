import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../../services/pago.service';
import { PagoResponse } from '../../../../models/dtos/pagos/PagoResponse';


@Component({
  selector: 'app-pago-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-success.html',
  styleUrl: './pago-success.css'
})
export class PagoSuccess implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pagoService = inject(PagoService);

  pago: PagoResponse | null = null;
  loading = true;
  error = false;

  ngOnInit(): void {
    const pagoId = this.route.snapshot.queryParamMap.get('pagoId');
    
    if (pagoId) {
      this.cargarPago(Number(pagoId));
    } else {
      this.error = true;
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
        this.error = true;
        this.loading = false;
      }
    });
  }

  volverAEventos(): void {
    this.router.navigate(['/eventos']);
  }

  irAMisPagos(): void {
    this.router.navigate(['/perfil', this.pago?.usuarioId]);
  }
}