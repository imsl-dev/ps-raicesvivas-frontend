import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoPeticion } from '../../../../../models/enums/Enums';
import { PeticionOrganizador } from '../../../../../models/entities/PeticionOrganizador';
import { FormsModule } from '@angular/forms';
import { PeticionService } from '../../../../../services/peticion.service';

@Component({
  selector: 'app-gestion-peticiones',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-peticiones.html',
  styleUrl: './gestion-peticiones.css'
})
export class GestionPeticiones implements OnInit {

  constructor(private peticionService: PeticionService) { }

  loading: boolean = false;
  peticiones: PeticionOrganizador[] = [];

  // Accordion control
  expandedPendienteId: number | null = null;
  expandedProcesadaId: number | null = null;

  // Paginación pendientes
  currentPagePendientes: number = 1;
  itemsPerPagePendientes: number = 5;

  // Paginación procesadas
  currentPageProcesadas: number = 1;
  itemsPerPageProcesadas: number = 5;

  // Filtros para peticiones procesadas
  searchTerm: string = '';
  filtroEstado: string = 'TODOS'; // 'TODOS', 'ACEPTADO', 'CANCELADO'

  ngOnInit(): void {
    this.loadPeticiones();
  }

  loadPeticiones(): void {
    this.loading = true;

    this.peticionService.getPeticiones().subscribe({
      next: (data) => {
        this.peticiones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando peticiones:', err);
        this.loading = false;
      }
    });

  }

  // Mock data generator (remove when API is ready)
  generateMockData(): PeticionOrganizador[] {
    return [
      {
        id: 1,
        usuarioId: 101,
        estadoPeticion: EstadoPeticion.PENDIENTE,
        mensajeUsuario: 'Me gustaría organizar eventos relacionados con la agricultura sostenible en mi región.',
        image64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzI4YTc0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SkQ8L3RleHQ+PC9zdmc+',
        nombreUsuario: 'Juan',
        apellidoUsuario: 'Pérez',
        email: 'juan.perez@example.com',
        userImage: ""
      },
      {
        id: 2,
        usuarioId: 102,
        estadoPeticion: EstadoPeticion.PENDIENTE,
        mensajeUsuario: 'Tengo experiencia organizando talleres de permacultura y me gustaría expandir mi alcance.',
        image64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzIwYzk5NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TUc8L3RleHQ+PC9zdmc+',
        nombreUsuario: 'María',
        apellidoUsuario: 'González',
        email: 'maria.gonzalez@example.com',
        userImage: ""
      },
      {
        id: 3,
        usuarioId: 103,
        estadoPeticion: EstadoPeticion.ACEPTADO,
        mensajeUsuario: 'Quiero organizar eventos de reforestación en zonas rurales.',
        image64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzE3YTJiOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q0w8L3RleHQ+PC9zdmc+',
        nombreUsuario: 'Carlos',
        apellidoUsuario: 'López',
        email: 'carlos.lopez@example.com',
        userImage: ""
      },
      {
        id: 4,
        usuarioId: 104,
        estadoPeticion: EstadoPeticion.CANCELADO,
        mensajeUsuario: 'Solicito ser organizador para eventos de compostaje comunitario.',
        image64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RjMzU0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QVI8L3RleHQ+PC9zdmc+',
        nombreUsuario: 'Ana',
        apellidoUsuario: 'Rodríguez',
        email: 'ana.rodriguez@example.com',
        userImage: ""
      },
      {
        id: 5,
        usuarioId: 105,
        estadoPeticion: EstadoPeticion.PENDIENTE,
        mensajeUsuario: 'Me interesa coordinar eventos educativos sobre huertos urbanos.',
        image64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmYzkwNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TE08L3RleHQ+PC9zdmc+',
        nombreUsuario: 'Luis',
        apellidoUsuario: 'Martínez',
        email: 'luis.martinez@example.com',
        userImage: ""
      },
      {
        id: 6,
        usuarioId: 106,
        estadoPeticion: EstadoPeticion.ACEPTADO,
        mensajeUsuario: 'Tengo contactos con ONGs ambientales y quiero organizar jornadas de limpieza.',
        image64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzZmNDJjMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+U0Y8L3RleHQ+PC9zdmc+',
        nombreUsuario: 'Sofía',
        apellidoUsuario: 'Fernández',
        email: 'sofia.fernandez@example.com',
        userImage: ""
      }
    ];
  }

  // Peticiones pendientes
  get peticionesPendientes(): PeticionOrganizador[] {
    return this.peticiones.filter(p => p.estadoPeticion === EstadoPeticion.PENDIENTE);
  }

  get paginatedPendientes(): PeticionOrganizador[] {
    const start = (this.currentPagePendientes - 1) * this.itemsPerPagePendientes;
    const end = start + this.itemsPerPagePendientes;
    return this.peticionesPendientes.slice(start, end);
  }

  get totalPagesPendientes(): number {
    return Math.ceil(this.peticionesPendientes.length / this.itemsPerPagePendientes);
  }

  // Peticiones procesadas (aceptadas o canceladas)
  get peticionesProcesadas(): PeticionOrganizador[] {
    return this.peticiones.filter(p => {
      const isProcessed = p.estadoPeticion !== EstadoPeticion.PENDIENTE;

      const matchSearch = !this.searchTerm ||
        p.nombreUsuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.apellidoUsuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchEstado = this.filtroEstado === 'TODOS' ||
        p.estadoPeticion === this.filtroEstado;

      return isProcessed && matchSearch && matchEstado;
    });
  }

  get paginatedProcesadas(): PeticionOrganizador[] {
    const start = (this.currentPageProcesadas - 1) * this.itemsPerPageProcesadas;
    const end = start + this.itemsPerPageProcesadas;
    return this.peticionesProcesadas.slice(start, end);
  }

  get totalPagesProcesadas(): number {
    return Math.ceil(this.peticionesProcesadas.length / this.itemsPerPageProcesadas);
  }

  // Accordion toggle
  togglePendiente(id: number | undefined): void {
    if (!id) return;
    this.expandedPendienteId = this.expandedPendienteId === id ? null : id;
  }

  toggleProcesada(id: number | undefined): void {
    if (!id) return;
    this.expandedProcesadaId = this.expandedProcesadaId === id ? null : id;
  }

  isPendienteExpanded(id: number | undefined): boolean {
    return this.expandedPendienteId === id;
  }

  isProcesadaExpanded(id: number | undefined): boolean {
    return this.expandedProcesadaId === id;
  }

  // Actions
  aceptarPeticion(peticion: PeticionOrganizador): void {
    console.log('Aceptar petición:', peticion);

    this.peticionService.aceptarPeticion(peticion.id!).subscribe({
      next: () => {
        peticion.estadoPeticion = EstadoPeticion.ACEPTADO;
        this.expandedPendienteId = null;
        alert('Petición aceptada exitosamente');
      },
      error: (err) => {
        console.error('Error aceptando petición:', err);
        alert('Error al aceptar la petición');
      }
    });

  }

  cancelarPeticion(peticion: PeticionOrganizador): void {
    console.log('Cancelar petición:', peticion);


    this.peticionService.cancelarPeticion(peticion.id!).subscribe({
      next: () => {
        peticion.estadoPeticion = EstadoPeticion.CANCELADO;
        this.expandedPendienteId = null;
        alert('Petición cancelada');
      },
      error: (err) => {
        console.error('Error cancelando petición:', err);
        alert('Error al cancelar la petición');
      }
    });

  }

  // Pagination
  changePendientesPage(page: number): void {
    if (page >= 1 && page <= this.totalPagesPendientes) {
      this.currentPagePendientes = page;
      this.expandedPendienteId = null;
    }
  }

  changeProcesadasPage(page: number): void {
    if (page >= 1 && page <= this.totalPagesProcesadas) {
      this.currentPageProcesadas = page;
      this.expandedProcesadaId = null;
    }
  }

  // Reset filters
  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroEstado = 'TODOS';
    this.currentPageProcesadas = 1;
  }

  // Helper
  getEstadoBadgeClass(estado: EstadoPeticion): string {
    switch (estado) {
      case EstadoPeticion.ACEPTADO:
        return 'badge-aceptado';
      case EstadoPeticion.CANCELADO:
        return 'badge-cancelado';
      case EstadoPeticion.PENDIENTE:
        return 'badge-pendiente';
      default:
        return '';
    }
  }
}