import { Component, inject, OnInit } from '@angular/core';
import { Evento } from '../../../../models/entities/Evento';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../services/evento.service';
import { Router } from '@angular/router';
import { TipoEvento, EstadoEvento, TipoDocumento, RolUsuario } from '../../../../models/enums/Enums';
import { Provincia } from '../../../../models/entities/auxiliares/Provincia';
import { HttpService } from '../../../../services/http.service';
import { TipoEventoPipe } from '../../../../pipes/tipo-evento.pipe';
import { Usuario } from '../../../../models/entities/Usuario';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-listado-eventos',
  imports: [FormsModule, CommonModule, TipoEventoPipe],
  templateUrl: './listado-eventos.html',
  styleUrl: './listado-eventos.css'
})
export class ListadoEventos implements OnInit {
  private readonly service = inject(EventoService);
  private readonly router = inject(Router);
  private readonly httpService = inject(HttpService);
  private readonly authService = inject(AuthService);

  eventos: Evento[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  verSoloMisEventos: boolean = false;
  usuarioLogeado: Usuario | null = null;

  // Filtros
  provincias: Provincia[] = [];
  tiposEvento = Object.values(TipoEvento).sort((a, b) => a.localeCompare(b));
  estadosEvento = Object.values(EstadoEvento);

  filtroProvincia: string = '';
  filtroTipo: string = '';
  filtroEstado: string = EstadoEvento.PROXIMO;
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';

  // Control sidebar mobile
  mostrarFiltros: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loadUsuarioLogeado();
    this.loadProvincias();
    if (this.usuarioLogeado?.rol === RolUsuario.ORGANIZADOR) {
      this.verSoloMisEventos = true;
    }
  }

  loadUsuarioLogeado(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (data) => {
        this.usuarioLogeado = data;
        this.loadEventos();
      },
      error: (err) => {
        console.error('Error cargando usuario logeado:', err);
        this.loadEventos();
      }
    });
  }

  loadEventos(): void {
    this.loading = true;
    this.error = null;

    this.service.getEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
        console.error('Error cargando eventos:', err);
      }
    });
  }

  loadProvincias(): void {
    this.httpService.getProvincias().subscribe({
      next: (data) => {
        this.provincias = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (err) => console.error('Error cargando provincias:', err)
    });
  }

  get filteredEventos(): Evento[] {
    return this.eventos.filter(evento => {
      const matchSearch = !this.searchTerm ||
        evento.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchProvincia = !this.filtroProvincia ||
        evento.provinciaId?.toString() === this.filtroProvincia.toString();

      const matchTipo = !this.filtroTipo || evento.tipo === this.filtroTipo;

      const matchEstado = !this.filtroEstado || evento.estado === this.filtroEstado;

      const matchFechaDesde = !this.filtroFechaDesde ||
        new Date(evento.horaInicio) >= new Date(this.filtroFechaDesde + 'T00:00:00');

      const matchFechaHasta = !this.filtroFechaHasta ||
        new Date(evento.horaInicio) <= new Date(this.filtroFechaHasta + 'T23:59:59');

      const matchOrganizador = !this.verSoloMisEventos ||
        !this.usuarioLogeado?.id ||
        evento.organizadorId === this.usuarioLogeado.id;

      return matchSearch && matchProvincia && matchTipo && matchEstado &&
        matchFechaDesde && matchFechaHasta && matchOrganizador;
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroProvincia = '';
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.verSoloMisEventos = true;
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  editEvento(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/eventos/editar', id]);
  }

  deleteEvento(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de que desea cancelar este evento? Luego no será posible reanudarlo.')) {
      this.service.deleteEvento(id).subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.id !== id);
          alert('Evento cancelado exitosamente');
        },
        error: (err) => {
          console.error('Error al cancelar el evento:', err);
          alert('Error al cancelar el evento. Por favor, intente nuevamente.');
        }
      });
    }
  }

  viewDetails(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/eventos', id]);
  }

  nuevoEvento(): void {
    this.router.navigate(['/eventos/nuevo']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoClass(estado: EstadoEvento): string {
    switch (estado) {
      case EstadoEvento.PROXIMO:
        return 'estado-proximo';
      case EstadoEvento.EN_CURSO:
        return 'estado-en-curso';
      case EstadoEvento.FINALIZADO:
        return 'estado-finalizado';
      case EstadoEvento.CANCELADO:
        return 'estado-cancelado';
      default:
        return '';
    }
  }
}