import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/entities/Evento';
import { TipoEventoPipe } from '../../../pipes/tipo-evento.pipe';

interface ParticipanteAsistencia {
  usuarioId: number;
  nombreUsuario: string;
  asistio: boolean;
}

@Component({
  selector: 'app-planilla-asistencia',
  imports: [CommonModule, FormsModule, TipoEventoPipe],
  templateUrl: './planilla-asistencia.html',
  styleUrl: './planilla-asistencia.css'
})
export class PlanillaAsistencia implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  evento: Evento | null = null;
  participantes: ParticipanteAsistencia[] = [];
  loading: boolean = true;
  guardando: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEvento(+id);
      this.cargarAsistencias(+id);
    } else {
      this.error = 'ID de evento no válido';
      this.loading = false;
    }
  }

  cargarEvento(id: number): void {
    this.eventoService.getEventoById(id).subscribe({
      next: (data: any) => {
        this.evento = {
          id: data.id,
          tipo: data.tipo,
          estado: data.estado,
          nombre: data.nombre,
          descripcion: data.descripcion,
          rutaImg: data.rutaImg,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
          horaInicio: data.horaInicio.toString(),
          horaFin: data.horaFin.toString(),
          puntosAsistencia: data.puntosAsistencia,
          costoInterno: data.costoInterno ? Number(data.costoInterno) : undefined,
          costoInscripcion: data.costoInscripcion ? Number(data.costoInscripcion) : undefined,
          organizadorId: data.organizadorId,
          provinciaId: data.provinciaId,
          sponsorId: data.sponsorId
        };
      },
      error: (err) => {
        console.error('Error cargando evento:', err);
        this.error = 'Error al cargar el evento';
        this.loading = false;
      }
    });
  }

  cargarAsistencias(eventoId: number): void {
    this.loading = true;
    this.error = null;

    this.eventoService.obtenerAsistenciasEvento(eventoId).subscribe({
      next: (response: any) => {
        this.participantes = response.usuariosAsistencias.sort((a: ParticipanteAsistencia, b: ParticipanteAsistencia) =>
          a.nombreUsuario.localeCompare(b.nombreUsuario)
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando asistencias:', err);
        this.error = 'Error al cargar las asistencias';
        this.loading = false;
      }
    });
  }

  guardarAsistencias(): void {
    if (!this.evento?.id) return;

    this.guardando = true;

    const asistencias = this.participantes.map(p => ({
      usuarioId: p.usuarioId,
      asistio: p.asistio
    }));

    this.eventoService.guardarAsistenciasEvento(this.evento.id, asistencias).subscribe({
      next: (response) => {
        alert('✅ Asistencias guardadas exitosamente');
        this.guardando = false;
        this.volver();
      },
      error: (err) => {
        console.error('Error guardando asistencias:', err);
        alert('❌ Error al guardar las asistencias. Por favor, intente nuevamente.');
        this.guardando = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/panel-organizador']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PROXIMO':
        return 'estado-proximo';
      case 'EN_CURSO':
        return 'estado-en-curso';
      case 'FINALIZADO':
        return 'estado-finalizado';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return '';
    }
  }
}