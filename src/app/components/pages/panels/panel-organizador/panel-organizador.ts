import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../../../models/entities/Usuario';
import { Evento } from '../../../../models/entities/Evento';
import { EstadoEvento } from '../../../../models/enums/Enums';
import { AuthService } from '../../../../services/auth.service';
import { EventoService } from '../../../../services/evento.service';

type MenuOption = 'asistencias' | 'reportes';

@Component({
  selector: 'app-panel-organizador',
  imports: [CommonModule],
  templateUrl: './panel-organizador.html',
  styleUrl: './panel-organizador.css'
})
export class PanelOrganizador implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly eventoService = inject(EventoService);
  private readonly router = inject(Router);

  usuarioLogeado: Usuario | null = null;
  selectedOption: MenuOption = 'asistencias';
  mostrarSidebar: boolean = false;
  loading: boolean = false;

  eventosEnCurso: Evento[] = [];
  eventosFinalizados: Evento[] = [];

  expandedEnCursoId: number | null = null;
  expandedFinalizadoId: number | null = null;

  ngOnInit(): void {
    this.loadUsuarioLogeado();
    this.loadEventos();
  }

  loadUsuarioLogeado(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (data) => {
        this.usuarioLogeado = data;
      },
      error: (err) => {
        console.error('Error cargando usuario logeado:', err);
      }
    });
  }

  loadEventos(): void {
    this.loading = true;
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        // Filtrar solo eventos del organizador logeado
        const eventosOrganizador = eventos.filter(
          (e: Evento) => e.organizadorId === this.usuarioLogeado?.id
        );

        this.eventosEnCurso = eventosOrganizador.filter(
          (e: Evento) => e.estado === EstadoEvento.EN_CURSO
        );

        this.eventosFinalizados = eventosOrganizador.filter(
          (e: Evento) => e.estado === EstadoEvento.FINALIZADO
        );

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando eventos:', err);
        this.loading = false;
      }
    });
  }

  selectOption(option: MenuOption): void {
    this.selectedOption = option;
    if (window.innerWidth <= 992) {
      this.mostrarSidebar = false;
    }
  }

  toggleSidebar(): void {
    this.mostrarSidebar = !this.mostrarSidebar;
  }

  isSelected(option: MenuOption): boolean {
    return this.selectedOption === option;
  }

  toggleEnCurso(id: number | undefined): void {
    if (!id) return;
    this.expandedEnCursoId = this.expandedEnCursoId === id ? null : id;
  }

  toggleFinalizado(id: number | undefined): void {
    if (!id) return;
    this.expandedFinalizadoId = this.expandedFinalizadoId === id ? null : id;
  }

  isEnCursoExpanded(id: number | undefined): boolean {
    return this.expandedEnCursoId === id;
  }

  isFinalizadoExpanded(id: number | undefined): boolean {
    return this.expandedFinalizadoId === id;
  }

  irAAsistencias(eventoId: number | undefined): void {
    if (!eventoId) return;
    this.router.navigate(['/asistencias', eventoId]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  contarInscritos(evento: any): number {
    return evento.cantidadInscritos || 0;
  }
}