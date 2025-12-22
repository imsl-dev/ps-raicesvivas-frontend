import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from '../../../models/entities/Usuario';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { SolicitudOrganizador } from '../../modals/solicitud-organizador/solicitud-organizador';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActualizarUsuarioDTO } from '../../../models/dtos/usuarios/ActualizarUsuarioDTO';
import { EstadoPeticion, RolUsuario } from '../../../models/enums/Enums';
import { PeticionOrganizador } from '../../../models/entities/PeticionOrganizador';
import { PeticionService } from '../../../services/peticion.service';
import { FrmSolicitudOrganizador } from '../../modals/frm-solicitud-organizador/frm-solicitud-organizador';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  solicitudDialog = inject(MatDialog)

  openDialog() {
    const dialogRef = this.solicitudDialog.open(SolicitudOrganizador, {
      data: {
        animal: "panda"
      }
    });

    // Listen for when the dialog chain is complete
    dialogRef.afterClosed().subscribe((result) => {
      // Check if a petition was successfully created
      if (result && result.success) {
        // Refetch the petition immediately
        if (this.user.id) {
          this.obtenerPeticionOrganizador(this.user.id);
        }
      }
    });
  }

  user: Usuario = {
    nombre: "Mock",
    apellido: "User",
    rol: RolUsuario.USUARIO
  }

  rolFormateado: string = ""

  loading = true;

  error?: string;

  isMyProfile: boolean = false;

  tienePeticionActiva = false;

  tienePeticionAceptada = false;

  tienePeticionCancelada = false;

  esAdministrador = false;

  peticionOrganizador: PeticionOrganizador = {
    usuarioId: 1,
    estadoPeticion: EstadoPeticion.PENDIENTE,
    image64: "",
    nombreUsuario: "",
    apellidoUsuario: "",
    email: "",
    userImage: ""
  }

  // Edit mode properties
  isEditMode: boolean = false;
  editForm: {
    nombre: string;
    apellido: string;
    email: string;
    idProvincia: number;
    rutaImg?: string;
  } = {
      nombre: '',
      apellido: '',
      email: '',
      idProvincia: 0,
      rutaImg: undefined
    };

  // Form validation
  formErrors: {
    nombre?: string;
    apellido?: string;
    email?: string;
    idProvincia?: string;
    rutaImg?: string;
  } = {};

  isSaving: boolean = false;

  provincias: any[] = [];

  // Image preview
  imagePreview: string | null = null;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private peticionService: PeticionService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.httpService.getUsuarioById(parseInt(userId)).subscribe({
        next: (usuario) => {
          this.user = usuario;
          this.rolFormateado = this.formatearRol(this.user.rol || RolUsuario.USUARIO)
          this.loading = false;
          this.checkIsMyProfile();
          this.esAdministrador = this.user.rol == RolUsuario.ADMIN
          if (this.user?.id)
            this.obtenerPeticionOrganizador(this.user.id)
        },
        error: (err) => {
          this.error = 'Error al cargar el perfil del usuario';
          this.loading = false;
        }
      });
    }

    // Load provincias for edit mode
    this.httpService.getProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: (err) => {
        console.error('Error loading provincias:', err);
      }
    });
  }

  formatearRol(rol: RolUsuario): string {
    const result = rol == RolUsuario.ADMIN ? "Administrador" :
      rol == RolUsuario.ORGANIZADOR ? "Organizador" :
        "Usuario"
    return result;
  }

  checkIsMyProfile() {
    this.authService.obtenerUsuarioLogueado().subscribe(
      (usuario) => {
        if (this.user?.id == usuario.id) {
          this.isMyProfile = true;
        }
      }
    )
  }

  editProfile() {
    if (!this.user) return;

    this.isEditMode = true;

    // Initialize form with current user data
    this.editForm = {
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      email: this.user.email || '',
      idProvincia: this.user.provincia?.id || 0,
      rutaImg: this.user.rutaImg || undefined
    };

    // Set initial image preview
    this.imagePreview = this.user.rutaImg || null;

    // Clear any previous errors
    this.formErrors = {};
  }

  cancelEdit() {
    this.isEditMode = false;
    this.formErrors = {};
    this.isSaving = false;
    this.imagePreview = null;
  }

  // Handle image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.formErrors.rutaImg = 'La imagen no debe superar los 5MB';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.formErrors.rutaImg = 'Solo se permiten imágenes JPG, PNG, WebP o GIF';
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64 = e.target?.result as string;
        this.imagePreview = base64;
        this.editForm.rutaImg = base64;
        this.formErrors.rutaImg = undefined;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeImage(): void {
    this.imagePreview = null;
    this.editForm.rutaImg = undefined;
  }

  // Get user initials for avatar placeholder
  getUserInitials(): string {
    const firstName = this.user.nombre?.charAt(0) || '';
    const lastName = this.user.apellido?.charAt(0) || '';
    return (firstName + lastName).toUpperCase();
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    // Validate nombre
    if (!this.editForm.nombre || this.editForm.nombre.trim().length === 0) {
      this.formErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (this.editForm.nombre.trim().length < 2) {
      this.formErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validate apellido
    if (!this.editForm.apellido || this.editForm.apellido.trim().length === 0) {
      this.formErrors.apellido = 'El apellido es requerido';
      isValid = false;
    } else if (this.editForm.apellido.trim().length < 2) {
      this.formErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validate provincia
    if (!this.editForm.idProvincia || this.editForm.idProvincia === 0) {
      this.formErrors.idProvincia = 'Debe seleccionar una provincia';
      isValid = false;
    }

    return isValid;
  }

  saveProfile() {
    if (!this.user || !this.validateForm()) {
      return;
    }

    this.isSaving = true;

    const updateDTO: ActualizarUsuarioDTO = {
      id: this.user.id || 1,
      nombre: this.editForm.nombre.trim(),
      apellido: this.editForm.apellido.trim(),
      email: this.editForm.email.trim(),
      idProvincia: this.editForm.idProvincia
    };

    // Only include rutaImg if it was changed
    if (this.editForm.rutaImg !== undefined) {
      updateDTO.rutaImg = this.editForm.rutaImg;
    }

    this.httpService.updateUser(updateDTO).subscribe({
      next: (updatedUser) => {
        // Update local user object
        this.user = updatedUser;
        this.rolFormateado = this.formatearRol(this.user.rol || RolUsuario.USUARIO);

        // Exit edit mode
        this.isEditMode = false;
        this.isSaving = false;
        this.imagePreview = null;

        // Optionally show success message
        console.log('Perfil actualizado exitosamente');
        this.authService.refreshUsuario();
      },
      error: (error) => {
        this.isSaving = false;
        this.error = 'Error al actualizar el perfil. Por favor, intente nuevamente.';
        console.error('Error updating profile:', error);
      }
    });
  }

  obtenerPeticionOrganizador(id: number) {
    this.peticionService.getPeticionByUserId(id).subscribe(
      {
        next: (peticion) => {
          if (peticion) {
            console.log("Peticion:", peticion);
            this.peticionOrganizador = peticion;
            this.tienePeticionActiva = true;

            if (this.peticionOrganizador.estadoPeticion == EstadoPeticion.ACEPTADO) {
              this.tienePeticionAceptada = true;
            }
            if (this.peticionOrganizador.estadoPeticion == EstadoPeticion.CANCELADO) {
              this.tienePeticionCancelada = true;
            }
          } else {
            this.tienePeticionActiva = false;
          }
        }
      }
    )
  }
}