import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Sponsor } from '../../../../models/entities/Sponsor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-sponsor',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo-sponsor.html',
  styleUrl: './nuevo-sponsor.css'
})
export class NuevoSponsor {
  sponsorForm: FormGroup;
  imagenPreview1: string | null = null;
  imagenPreview2: string | null = null;

  constructor(private fb: FormBuilder) {
    this.sponsorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      rutaImg1: [''],
      rutaImg2: ['']
    });
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

  onSubmit(): void {
    if (this.sponsorForm.valid) {
      const sponsorData: Sponsor = this.sponsorForm.value;
      console.log('Datos del sponsor:', sponsorData);
      
      // Aquí llamarías a tu servicio para guardar el sponsor
      // this.sponsorService.crearSponsor(sponsorData).subscribe(...)
      
      this.resetForm();
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
