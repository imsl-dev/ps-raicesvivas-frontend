import { Component, inject, OnInit } from '@angular/core';
import { Sponsor } from '../../../../../models/entities/Sponsor';
import { Router } from '@angular/router';
import { Canjeable } from '../../../../../models/entities/Canjeable';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-canjeables',
  imports: [FormsModule],
  templateUrl: './gestion-canjeables.html',
  styleUrl: './gestion-canjeables.css'
})
export class GestionCanjeables implements OnInit {
  private readonly router = inject(Router);

  loading: boolean = false;
  sponsors: Sponsor[] = [];

  // Formulario
  formData: Canjeable = {
    nombre: '',
    sponsorId: 0,
    url: '',
    costoPuntos: 0,
    validoHasta: ''
  };

  // Validación
  errors: { [key: string]: string } = {};

  ngOnInit(): void {
    this.loadSponsors();
    this.setMinDate();
  }

  loadSponsors(): void {
    this.loading = true;

    // TODO: Replace with actual API call
    // this.sponsorService.getAll().subscribe({
    //   next: (data) => {
    //     this.sponsors = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando sponsors:', err);
    //     this.loading = false;
    //   }
    // });

    // Mock data for now
    setTimeout(() => {
      this.sponsors = this.generateMockSponsors();
      this.loading = false;
    }, 500);
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
    // Set minimum date to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.formData.validoHasta = `${year}-${month}-${day}`;
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

    console.log('Crear canjeable:', this.formData);

    // TODO: Replace with actual API call
    // this.canjeableService.create(this.formData).subscribe({
    //   next: (response) => {
    //     alert('Canjeable creado exitosamente');
    //     this.resetForm();
    //   },
    //   error: (err) => {
    //     console.error('Error creando canjeable:', err);
    //     alert('Error al crear el canjeable');
    //   }
    // });

    // Simulate API call
    setTimeout(() => {
      alert('Canjeable creado exitosamente');
      this.resetForm();
    }, 500);
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      sponsorId: 0,
      url: '',
      costoPuntos: 0,
      validoHasta: ''
    };
    this.errors = {};
    this.setMinDate();
  }

  getSponsorName(sponsorId: number): string {
    const sponsor = this.sponsors.find(s => s.id === Number(sponsorId));
    return sponsor ? sponsor.nombre : '';
  }
}
