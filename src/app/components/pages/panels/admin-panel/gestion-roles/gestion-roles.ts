import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../../models/entities/Usuario';
import { RolUsuario, TipoDocumento } from '../../../../../models/enums/Enums';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../../services/usuario.service';
import { Router } from '@angular/router';

export interface ActualizarRolDTO {
  usuario: Usuario;
  nuevoRol: RolUsuario;
}

@Component({
  selector: 'app-gestion-roles',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-roles.html',
  styleUrl: './gestion-roles.css'
})
export class GestionRoles implements OnInit {

  private readonly router = inject(Router);

  constructor(private usuarioService: UsuarioService) { }

  loading: boolean = false;
  usuarios: Usuario[] = [];

  // Filtros
  searchTerm: string = '';
  filtroRol: string = 'TODOS';
  roles = Object.values(RolUsuario);

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Modal de confirmación
  showModal: boolean = false;
  pendingRoleChange: ActualizarRolDTO | null = null;

  // Almacenar roles originales para poder revertir
  private originalRoles: Map<number, RolUsuario> = new Map();

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;

    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        // Guardar los roles originales
        this.usuarios.forEach(u => {
          if (u.id && u.rol) {
            this.originalRoles.set(u.id, u.rol);
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loading = false;
      }
    });
  }

  // Filtrado
  get filteredUsuarios(): Usuario[] {
    return this.usuarios.filter(usuario => {
      const matchSearch = !this.searchTerm ||
        usuario.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchRol = this.filtroRol === 'TODOS' || usuario.rol === this.filtroRol;

      return matchSearch && matchRol;
    });
  }

  // Paginación
  get paginatedUsuarios(): Usuario[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsuarios.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Modal y cambio de rol
  onRoleChange(usuario: Usuario, nuevoRol: RolUsuario): void {
    if (!usuario.id || !usuario.rol) return;

    // Obtener el rol actual del usuario desde el mapa
    const rolActual = this.originalRoles.get(usuario.id) || usuario.rol;

    // Si el rol es el mismo que el actual, no hacer nada
    if (nuevoRol === rolActual) {
      return;
    }

    console.log('Role change detected:', {
      usuario: usuario.nombre,
      rolActual: rolActual,
      nuevoRol: nuevoRol
    });

    // Guardar el cambio pendiente y mostrar modal
    this.pendingRoleChange = {
      usuario: { ...usuario, rol: rolActual }, // Guardar copia con rol actual
      nuevoRol: nuevoRol
    };

    // Mostrar modal
    this.showModal = true;

    // Revertir visualmente el dropdown al rol actual
    setTimeout(() => {
      usuario.rol = rolActual;
    }, 0);
  }

  confirmarCambioRol(): void {
    if (!this.pendingRoleChange || !this.pendingRoleChange.usuario.id) return;

    const { usuario, nuevoRol } = this.pendingRoleChange;

    console.log('Cambiar rol de usuario:', usuario.id, 'a:', nuevoRol);

    this.usuarioService.cambiarRol(usuario.id!, nuevoRol).subscribe({
      next: () => {
        // Actualizar el rol en el usuario
        const usuarioEnLista = this.usuarios.find(u => u.id === usuario.id);
        if (usuarioEnLista) {
          usuarioEnLista.rol = nuevoRol;
          // Actualizar el mapa de roles originales
          if (usuario.id) {
            this.originalRoles.set(usuario.id, nuevoRol);
          }
        }
        this.closeModal();
        alert(`Rol actualizado exitosamente a ${nuevoRol}`);
      },
      error: (err) => {
        console.error('Error cambiando rol:', err);
        alert('Error al cambiar el rol del usuario');
        this.closeModal();
      }
    });
  }

  cancelarCambioRol(): void {
    // Asegurarse de que el rol se revierta al cerrar el modal
    if (this.pendingRoleChange && this.pendingRoleChange.usuario.id) {
      const usuarioEnLista = this.usuarios.find(u => u.id === this.pendingRoleChange!.usuario.id);
      const rolOriginal = this.originalRoles.get(this.pendingRoleChange.usuario.id);
      if (usuarioEnLista && rolOriginal) {
        usuarioEnLista.rol = rolOriginal;
      }
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
    this.pendingRoleChange = null;
  }

  // Helpers
  getRolBadgeClass(rol?: RolUsuario): string {
    switch (rol) {
      case RolUsuario.ADMIN:
        return 'badge-admin';
      case RolUsuario.ORGANIZADOR:
        return 'badge-organizador';
      case RolUsuario.USUARIO:
        return 'badge-participante';
      default:
        return '';
    }
  }

  getUserInitials(usuario: Usuario): string {
    return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroRol = 'TODOS';
    this.currentPage = 1;
  }

  navigateToProfile(usuarioId: number | undefined): void {
    if (!usuarioId) return;
    this.router.navigate(['/perfil', usuarioId]);
  }
}