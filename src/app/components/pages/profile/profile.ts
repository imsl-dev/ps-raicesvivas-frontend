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
  } = {
      nombre: '',
      apellido: '',
      email: '',
      idProvincia: 0
    };

  // Form validation
  formErrors: {
    nombre?: string;
    apellido?: string;
    email?: string;
    idProvincia?: string;
  } = {};

  isSaving: boolean = false;

  // You'll need to populate this with available provinces
  provincias: any[] = [];

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private peticionService: PeticionService,
    private route: ActivatedRoute) { }


  ngOnInit(): void {
    //cargar datos del perfil basado en usuario
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.httpService
      .getUsuarioById(id)
      .subscribe({
        next: (usuario) => {
          this.user = usuario;
          this.loading = false;
          this.rolFormateado = this.formatearRol(this.user.rol)
          //checkear si es mi perfil

          this.checkIsMyProfile()

          //checkear si es admin para no mostrar boton peticion

          if (this.user.rol == RolUsuario.ADMIN) {
            this.esAdministrador = true;
          }
          //obtener peticion organizador
          this.obtenerPeticionOrganizador(id);

        },
        error: () => {
          this.error = 'Error al cargar los datos de usuario'
          this.loading = false
        }
      })

    // Load provinces for the dropdown
    this.loadProvincias();
  }



  loadProvincias() {

    this.httpService.getProvincias().subscribe(provincias => {
      this.provincias = provincias;
    });
  }

  formatearRol(rol: RolUsuario | undefined) {

    if (rol == undefined) {
      return "ROL"
    }

    const splitted = rol.toLocaleLowerCase().split("")

    const uppercase = splitted[0].toUpperCase()

    splitted.shift()

    const result = uppercase + splitted.join("")


    return result == "Admin" ? "Administrador" : result

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
      idProvincia: this.user.provincia?.id || 0
    };

    // Clear any previous errors
    this.formErrors = {};
  }

  cancelEdit() {
    this.isEditMode = false;
    this.formErrors = {};
    this.isSaving = false;
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

    // Validate email
    if (!this.editForm.email || this.editForm.email.trim().length === 0) {
      this.formErrors.email = 'El email es requerido';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.editForm.email)) {
        this.formErrors.email = 'El email no es válido';
        isValid = false;
      }
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

    this.httpService.updateUser(updateDTO).subscribe({
      next: (updatedUser) => {
        // Update local user object
        this.user = updatedUser;
        this.rolFormateado = this.formatearRol(this.user.rol || RolUsuario.USUARIO);

        // Exit edit mode
        this.isEditMode = false;
        this.isSaving = false;

        // Optionally show success message
        console.log('Perfil actualizado exitosamente');
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

          }

          else {
            this.tienePeticionActiva = false;
          }

        }
      }
    )
  }

}