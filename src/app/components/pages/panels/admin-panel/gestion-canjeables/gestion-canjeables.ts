import { Component, inject, OnInit } from '@angular/core';
import { Sponsor } from '../../../../../models/entities/Sponsor';
import { Router } from '@angular/router';
import { Canjeable } from '../../../../../models/entities/Canjeable';
import { FormsModule } from '@angular/forms';
import { SponsorService } from '../../../../../services/sponsor.service';
import { CanjeableService } from '../../../../../services/canjeable.service';
import { NuevoCanjeableDTO } from '../../../../../models/dtos/canjeables/NuevoCanjeableDTO';

@Component({
  selector: 'app-gestion-canjeables',
  imports: [FormsModule],
  templateUrl: './gestion-canjeables.html',
  styleUrl: './gestion-canjeables.css'
})
export class GestionCanjeables implements OnInit {
  private readonly router = inject(Router);

  constructor(
    private sponsorService: SponsorService,
    private canjeableService: CanjeableService
  ) {
  }

  loading: boolean = false;
  sponsors: Sponsor[] = [];

  // Formulario
  formData: Canjeable = {
    nombre: '',
    sponsorId: 0,
    url: '',
    costoPuntos: 0,
    validoHasta: '',
    nombreSponsor: ""
  };

  // Validación
  errors: { [key: string]: string } = {};

  ngOnInit(): void {
    this.loadSponsors();
    this.setMinDate();
  }

  loadSponsors(): void {
    this.loading = true;

    this.sponsorService.getSponsor().subscribe({
      next: (data) => {
        this.sponsors = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando sponsors:', err);
        this.loading = false;
      }
    });


  }

  // Mock data (remove when API is ready)
  generateMockSponsors(): Sponsor[] {
    return [
      { id: 1, nombre: 'EcoMercado Local' },
      { id: 2, nombre: 'Semillas Orgánicas SA' },
      { id: 3, nombre: 'Cooperativa Verde' },
      { id: 4, nombre: 'Tienda Natural' },
      { id: 5, nombre: 'Agro Sustentable' }
    ];
  }

  setMinDate(): void {
    // Set minimum date to today with time
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.formData.validoHasta = `${year}-${month}-${day}T23:59:59`;
  }
  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    // Validar nombre
    if (!this.formData.nombre || this.formData.nombre.trim() === '') {
      this.errors['nombre'] = 'El nombre es obligatorio';
      isValid = false;
    }

    // Validar sponsor
    if (!this.formData.sponsorId || this.formData.sponsorId === 0) {
      this.errors['sponsorId'] = 'Debe seleccionar un sponsor';
      isValid = false;
    }

    // Validar URL (ahora obligatoria)
    if (!this.formData.url || this.formData.url.trim() === '') {
      this.errors['url'] = 'La URL es obligatoria';
      isValid = false;
    } else {
      try {
        new URL(this.formData.url);
      } catch {
        this.errors['url'] = 'La URL ingresada no es válida';
        isValid = false;
      }
    }

    // Validar costo de puntos
    if (!this.formData.costoPuntos || this.formData.costoPuntos <= 0) {
      this.errors['costoPuntos'] = 'El costo debe ser mayor a 0';
      isValid = false;
    }

    // Validar fecha
    if (!this.formData.validoHasta) {
      this.errors['validoHasta'] = 'Debe seleccionar una fecha de vencimiento';
      isValid = false;
    } else {
      const selectedDate = new Date(this.formData.validoHasta);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        this.errors['validoHasta'] = 'La fecha debe ser hoy o posterior';
        isValid = false;
      }
    }

    return isValid;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    // Convert date to LocalDateTime format (add time if not present)
    let validoHastaFormatted = this.formData.validoHasta;
    if (!validoHastaFormatted.includes('T')) {
      // If only date is provided, add end of day time
      validoHastaFormatted = `${validoHastaFormatted}T23:59:59`;
    }

    const canjeableDTO: NuevoCanjeableDTO = {
      nombre: this.formData.nombre,
      sponsorId: this.formData.sponsorId,
      costoPuntos: this.formData.costoPuntos,
      url: this.formData.url!,
      validoHasta: validoHastaFormatted,
      nombreSponsor: this.sponsors.find((sponsor) => sponsor.id === this.formData.sponsorId)?.nombre || ""
    };

    console.log("[Gestion Canjeables] Posteando canjeable: ", canjeableDTO);
    this.canjeableService.postCanjeable(canjeableDTO).subscribe({

      next: (response) => {
        alert('Canjeable creado exitosamente');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creando canjeable:', err);
        alert('Error al crear el canjeable');
      }
    });


  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      sponsorId: 0,
      url: '',
      costoPuntos: 0,
      validoHasta: '',
      nombreSponsor: ''
    };
    this.errors = {};
    this.setMinDate();
  }

  getSponsorName(sponsorId: number): string {
    const sponsor = this.sponsors.find(s => s.id === Number(sponsorId));
    return sponsor ? sponsor.nombre : '';
  }

  getSponsorImage(sponsorId: number): string | undefined {
    const sponsor = this.sponsors.find(s => s.id === Number(sponsorId));
    return sponsor?.rutaImg1;
  }
}
