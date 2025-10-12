import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Sponsor } from '../../../../models/entities/Sponsor';
import { CommonModule } from '@angular/common';
import { SponsorService } from '../../../../services/sponsor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-sponsor',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo-sponsor.html',
  styleUrl: './nuevo-sponsor.css'
})
export class NuevoSponsor implements OnInit {
  private readonly service = inject(SponsorService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // ID del sponsor a editar
  sponsorId: number | null = null;

  // Modo de vista (ver solo)
  isViewMode: boolean = false;

  sponsorForm: FormGroup;
  imagenPreview1: string | null = null;
  imagenPreview2: string | null = null;

  constructor(private fb: FormBuilder) {
    this.sponsorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      linkDominio: [''],
      rutaImg1: [''],
      rutaImg2: [''],
      activo: [true]
    });
  }

  get tituloFormulario(): string {
  if (this.isViewMode) return 'Detalle del Sponsor';
  return this.sponsorId ? 'Modificar Sponsor' : 'Alta de Sponsor';
}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.sponsorId = +id;
        // Verificar si es modo vista
        this.isViewMode = this.router.url.includes('/ver/');
        this.loadSponsor(id);
      }
    });
  }

  loadSponsor(id: number): void {
    this.service.getSponsorById(id).subscribe({
      next: (sponsor) => {
        this.sponsorForm.patchValue({
          nombre: sponsor.nombre,
          linkDominio: sponsor.linkDominio || '',
          rutaImg1: sponsor.rutaImg1 || '',
          rutaImg2: sponsor.rutaImg2 || '',
          activo: sponsor.activo ?? true
        });
        this.imagenPreview1 = sponsor.rutaImg1 || null;
        this.imagenPreview2 = sponsor.rutaImg2 || null;
        this.setFormViewMode();
      },
      error: (err) => {
        console.error('Error al cargar el sponsor:', err);
        alert('Error al cargar los datos del sponsor');
      }
    });
  }

  private setFormViewMode(): void {
  if (this.isViewMode) {
    this.sponsorForm.disable();
  }
}

  onFileSelected(event: Event, imageNumber: 1 | 2): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (imageNumber === 1) {
          this.imagenPreview1 = result;
          this.sponsorForm.patchValue({ rutaImg1: result });
        } else {
          this.imagenPreview2 = result;
          this.sponsorForm.patchValue({ rutaImg2: result });
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(imageNumber: 1 | 2): void {
    if (imageNumber === 1) {
      this.imagenPreview1 = null;
      this.sponsorForm.patchValue({ rutaImg1: '' });
    } else {
      this.imagenPreview2 = null;
      this.sponsorForm.patchValue({ rutaImg2: '' });
    }
  }

  volver(): void {
  this.router.navigate(['/sponsors']);
}

  onSubmit(): void {
    if (this.sponsorForm.valid) {
      const sponsorData: Sponsor = {
        ...this.sponsorForm.value,
        id: this.sponsorId || undefined
      };

      const request = this.sponsorId
        ? this.service.putSponsor(sponsorData)
        : this.service.postSponsor(sponsorData);

      request.subscribe({
        next: (response) => {
          const mensaje = this.sponsorId ? 'actualizado' : 'creado';
          alert(`Sponsor ${mensaje} exitosamente`);
          this.router.navigate(['/sponsors']);
        },
        error: (error) => {
          console.error('Error al guardar el sponsor:', error);
          alert('Error al guardar el sponsor. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.markFormGroupTouched(this.sponsorForm);
    }
  }

  resetForm(): void {
    this.sponsorForm.reset();
    this.imagenPreview1 = null;
    this.imagenPreview2 = null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombre() {
    return this.sponsorForm.get('nombre');
  }
}
