import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../../services/pago.service';
import { PagoResponse } from '../../../../models/dtos/pagos/PagoResponse';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pago-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-success.html',
  styleUrl: './pago-success.css'
})
export class PagoSuccess implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pagoService = inject(PagoService);

  pago: PagoResponse | null = null;
  loading = true;
  error = false;
  verificandoEstado = false;
  intentos = 0;
  maxIntentos = 20; // 20 intentos × 3 segundos = 1 minuto máximo

  private pollingSubscription?: Subscription;

  ngOnInit(): void {
    const pagoId = this.route.snapshot.queryParamMap.get('pagoId');
    
    if (pagoId) {
      this.iniciarVerificacion(Number(pagoId));
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.detenerVerificacion();
  }

  iniciarVerificacion(pagoId: number): void {
    // Primera carga inmediata
    this.cargarPago(pagoId);

    // Luego polling cada 3 segundos
    this.pollingSubscription = interval(3000)
      .pipe(
        switchMap(() => this.pagoService.obtenerPago(pagoId))
      )
      .subscribe({
        next: (pago) => {
          this.intentos++;
          this.pago = pago;
          this.loading = false;

          // Si el pago está aprobado, detener el polling
          if (pago.estadoPago === 'APROBADO') {
            console.log('✅ Pago aprobado, deteniendo verificación');
            this.detenerVerificacion();
          }

          // Si alcanzamos el máximo de intentos, detener
          if (this.intentos >= this.maxIntentos) {
            console.log('⏱️ Tiempo máximo de verificación alcanzado');
            this.detenerVerificacion();
          }
        },
        error: (err) => {
          console.error('Error al verificar el pago:', err);
          this.intentos++;
          
          if (this.intentos >= this.maxIntentos) {
            this.error = true;
            this.loading = false;
            this.detenerVerificacion();
          }
        }
      });
  }

  cargarPago(pagoId: number): void {
    this.pagoService.obtenerPago(pagoId).subscribe({
      next: (pago) => {
        this.pago = pago;
        this.loading = false;

        // Si ya está aprobado desde el inicio, no hacer polling
        if (pago.estadoPago === 'APROBADO') {
          this.detenerVerificacion();
        }
      },
      error: (err) => {
        console.error('Error al cargar el pago:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  detenerVerificacion(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.verificandoEstado = false;
    }
  }

  verificarManualmente(): void {
    if (this.pago?.id) {
      this.verificandoEstado = true;
      this.cargarPago(this.pago.id);
      setTimeout(() => this.verificandoEstado = false, 2000);
    }
  }

  volverAEventos(): void {
    this.detenerVerificacion();
    this.router.navigate(['/eventos']);
  }

  irAMisPagos(): void {
    this.detenerVerificacion();
    this.router.navigate(['/perfil', this.pago?.usuarioId]);
  }
}