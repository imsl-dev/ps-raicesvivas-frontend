import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  pagoId: number | null = null;

  ngOnInit(): void {
    const pagoIdParam = this.route.snapshot.queryParamMap.get('pagoId');
    if (pagoIdParam) {
      this.pagoId = Number(pagoIdParam);
    }
  }

  reintentar(): void {
    this.router.navigate(['/eventos']);
  }

  volverAEventos(): void {
    this.router.navigate(['/eventos']);
  }
}