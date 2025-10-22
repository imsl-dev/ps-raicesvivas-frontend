import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError, MatHint } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-frm-solicitud-organizador',
  templateUrl: './frm-solicitud-organizador.html',
  imports: [MatFormField, MatLabel, MatDialogActions, MatError, MatHint, MatDialogContent, ReactiveFormsModule, MatInput, MatButton, MatDialogTitle],
})
export class FrmSolicitudOrganizador {
  formSolicitud: FormGroup;
  selectedImage: string | null = null;
  fileData: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FrmSolicitudOrganizador>
  ) {
    this.formSolicitud = this.fb.group({
      motivo: ['', [Validators.required, Validators.maxLength(500)]],
      idImage: [null, Validators.required],
      cbu: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(22),
          Validators.maxLength(22),
        ],
      ],
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileData = file;
      this.formSolicitud.patchValue({ idImage: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.formSolicitud.valid) {
      const formData = new FormData();
      formData.append('motivo', this.formSolicitud.get('motivo')?.value);
      formData.append('cbu', this.formSolicitud.get('cbu')?.value);
      if (this.fileData) {
        formData.append('idImage', this.fileData);
      }

      // You can send `formData` to your backend here
      console.log('Form data ready to submit:', this.formSolicitud.value);

      this.dialogRef.close(this.formSolicitud.value);
    }
  }

  onCancel() {
    this.dialogRef.close()
  }
}
