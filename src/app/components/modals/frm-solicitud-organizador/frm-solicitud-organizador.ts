import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError, MatHint } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { PeticionService } from '../../../services/peticion.service';
import { PeticionOrganizador } from '../../../models/entities/PeticionOrganizador';
import { PeticionOrganizadorPostDTO } from '../../../models/dtos/peticionesOrganizador/PeticionOrganizadorPostDTO';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/entities/Usuario';

@Component({
  selector: 'app-frm-solicitud-organizador',
  templateUrl: './frm-solicitud-organizador.html',
  imports: [MatFormField, MatLabel, MatDialogActions, MatError, MatHint, MatDialogContent, ReactiveFormsModule, MatInput, MatButton, MatDialogTitle],
})
export class FrmSolicitudOrganizador implements OnInit {
  formSolicitud: FormGroup;
  selectedImage: string | null = null;
  fileData: File | null = null;

  user: Usuario = {
    id: 1,
    nombre: "",
    apellido: ""
  }

  ngOnInit(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (usuario) => {
        this.user = usuario;
      }
    })
  }

  constructor(
    private fb: FormBuilder,
    private peticionService: PeticionService,
    private authService: AuthService,
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

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.formSolicitud.patchValue({ idImage: this.selectedImage })
        console.log("Selected image: ", this.selectedImage);
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
      const peticion: PeticionOrganizadorPostDTO = {
        idUsuario: this.user.id || 1,
        mensajeUsuario: this.formSolicitud.get('motivo')?.value!,
        image64: this.selectedImage as string
      }
      console.log("Image data:", this.formSolicitud.get('idImage')?.value!);
      this.peticionService.postPeticion(peticion).subscribe({
        next: (response) => {

        }
      })

      this.dialogRef.close(this.formSolicitud.value);
    }
  }

  onCancel() {
    this.dialogRef.close()
  }


}
