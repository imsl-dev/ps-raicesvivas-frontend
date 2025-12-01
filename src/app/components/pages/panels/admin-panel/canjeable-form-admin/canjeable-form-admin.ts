import { Component, inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';


import { CommonModule } from '@angular/common';
import { CanjeableService } from '../../../../../services/canjeable.service';
import { SponsorService } from '../../../../../services/sponsor.service';
import { CanjeableAction } from '../gestion-canjeables/gestion-canjeables';
import { Sponsor } from '../../../../../models/entities/Sponsor';
import { Canjeable } from '../../../../../models/entities/Canjeable';
import { NuevoCanjeableDTO } from '../../../../../models/dtos/canjeables/NuevoCanjeableDTO';

@Component({
  selector: 'app-canjeable-form-admin',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './canjeable-form-admin.html',
  styleUrl: './canjeable-form-admin.css'
})
export class CanjeableFormAdmin implements OnInit {
  private readonly canjeableService = inject(CanjeableService);
  private readonly sponsorService = inject(SponsorService);
  private readonly fb = inject(FormBuilder);

  @Input() canjeableId: number | null = null;
  @Input() action: CanjeableAction = 'crear';
  @Output() formClosed = new EventEmitter<{ saved: boolean, action?: string }>(); // Include action

  isViewMode: boolean = false;
  canjeableForm: FormGroup;
  sponsors: Sponsor[] = [];
  loading: boolean = false;

  constructor() {
    this.canjeableForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      sponsorId: [null, [Validators.required]],
      url: ['', [Validators.maxLength(500)]],
      costoPuntos: [0, [Validators.required, Validators.min(1)]],
      validoHasta: ['', [Validators.required]],
      activo: [true]
    });
  }

  get tituloFormulario(): string {
    if (this.isViewMode) return 'Detalle del Canjeable';
    return this.canjeableId ? 'Modificar Canjeable' : 'Alta de Canjeable';
  }

  ngOnInit(): void {
    this.isViewMode = this.action === 'ver';
    this.loadSponsors();

    if (this.canjeableId) {
      this.loadCanjeable(this.canjeableId);
    }
  }

  loadSponsors(): void {
    this.sponsorService.getSponsor().subscribe({
      next: (data) => {
        this.sponsors = data.filter((s: Sponsor) => s.activo);
      },
      error: (err) => {
        console.error('Error cargando sponsors:', err);
      }
    });
  }

  loadCanjeable(id: number): void {
    this.loading = true;
    this.canjeableService.getCanjeableById(id).subscribe({
      next: (canjeable: Canjeable) => {
        // Convertir fecha a formato YYYY-MM-DD para input type="date"
        const fechaFormato = this.convertirFechaParaInput(canjeable.validoHasta);

        this.canjeableForm.patchValue({
          nombre: canjeable.nombre,
          sponsorId: canjeable.sponsorId,
          url: canjeable.url || '',
          costoPuntos: canjeable.costoPuntos,
          validoHasta: fechaFormato,
          activo: canjeable.activo ?? true
        });

        this.setFormViewMode();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el canjeable:', err);
        alert('Error al cargar los datos del canjeable');
        this.loading = false;
      }
    });
  }

  private convertirFechaParaInput(fecha: string): string {
    // Convierte de "2024-12-31T23:59:59" a "2024-12-31"
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private convertirFechaParaDTO(fechaInput: string): string {
    // Convierte de "2024-12-31" a "2024-12-31T23:59:59"
    return `${fechaInput}T23:59:59`;
  }

  private setFormViewMode(): void {
    if (this.isViewMode) {
      this.canjeableForm.disable();
    }
  }

  volver(): void {
    this.formClosed.emit({ saved: false });
  }

  onSubmit(): void {
    if (this.canjeableForm.valid) {
      const formValue = this.canjeableForm.value;

      // Obtener nombre del sponsor seleccionado
      const sponsor = this.sponsors.find(s => s.id === formValue.sponsorId);
      const nombreSponsor = sponsor?.nombre || '';

      const dto: NuevoCanjeableDTO = {
        nombre: formValue.nombre,
        sponsorId: formValue.sponsorId,
        url: formValue.url,
        costoPuntos: formValue.costoPuntos,
        validoHasta: this.convertirFechaParaDTO(formValue.validoHasta),
        nombreSponsor: nombreSponsor,
        activo: formValue.activo
      };

      const request = this.canjeableId
        ? this.canjeableService.putCanjeable(this.canjeableId, dto)
        : this.canjeableService.postCanjeable(dto);

      request.subscribe({
        next: (response) => {
          const action = this.canjeableId ? 'editar' : 'crear';
          this.formClosed.emit({ saved: true, action: action });
        },
        error: (error) => {
          console.error('Error al guardar el canjeable:', error);
          alert(error.error?.message || 'Error al guardar el canjeable. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.markFormGroupTouched(this.canjeableForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombre() {
    return this.canjeableForm.get('nombre');
  }

  get sponsorId() {
    return this.canjeableForm.get('sponsorId');
  }

  get costoPuntos() {
    return this.canjeableForm.get('costoPuntos');
  }

  get validoHasta() {
    return this.canjeableForm.get('validoHasta');
  }
}