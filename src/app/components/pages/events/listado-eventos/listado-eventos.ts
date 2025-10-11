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

  eventos: Evento[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
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
    this.loadEventos();
    this.loadProvincias();
  }

  loadUsuarioLogeado(): void {
    this.usuarioLogeado = {
      id: 1,
      nombre: 'María',
      apellido: 'Organizadora',
      tipoDocumento: TipoDocumento.DNI,
      nroDocumento: '23456789',
      rol: RolUsuario.ORGANIZADOR,
      provincia: { id: 5, nombre: 'Córdoba' },
      puntos: 100
    };

    // this.httpService.getUsuarioLogeado().subscribe({
    //   next: (data) => {
    //     this.usuarioLogeado = data;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando usuario logeado:', err);
    //   }
    // });
  }

  loadEventos(): void {
    this.loading = true;
    this.error = null;

    if (this.usuarioLogeado?.rol === 'ORGANIZADOR' && this.usuarioLogeado.id) {
      this.service.getEventosOrganizador(this.usuarioLogeado.id).subscribe({
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
    else {
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

      return matchSearch && matchProvincia && matchTipo && matchEstado &&
        matchFechaDesde && matchFechaHasta;
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroProvincia = '';
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  editEvento(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/eventos/editar', id]);
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