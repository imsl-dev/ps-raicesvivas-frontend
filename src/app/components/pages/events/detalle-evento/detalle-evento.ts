import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../services/evento.service';
import { Evento } from '../../../../models/entities/Evento';
import { TipoEventoPipe } from '../../../../pipes/tipo-evento.pipe';

@Component({
  selector: 'app-detalle-evento',
  imports: [CommonModule, TipoEventoPipe],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css'
})
export class DetalleEvento implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  evento: Evento | null = null;
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvento(+id);
    } else {
      this.error = 'ID de evento no válido';
      this.loading = false;
    }
  }

  loadEvento(id: number): void {
    this.loading = true;
    this.error = null;

    this.eventoService.getEventoById(id).subscribe({
      next: (data: any) => {
        // Mapear el response DTO al formato de Evento del frontend
        this.evento = {
          id: data.id,
          tipo: data.tipo,
          estado: data.estado,
          nombre: data.nombre,
          descripcion: data.descripcion,
          rutaImg: data.rutaImg,
          direccion: data.direccion,
          horaInicio: data.horaInicio.toString(),
          horaFin: data.horaFin.toString(),
          puntosAsistencia: data.puntosAsistencia,
          costoInterno: data.costoInterno ? Number(data.costoInterno) : undefined,
          costoInscripcion: data.costoInscripcion ? Number(data.costoInscripcion) : undefined,
          organizadorId: data.organizadorId,
          provinciaId: data.provinciaId,
          sponsorId: data.sponsorId,
          provincia: data.provinciaNombre ? { id: data.provinciaId, nombre: data.provinciaNombre } : undefined,
          sponsor: data.sponsorNombre ? { id: data.sponsorId, nombre: data.sponsorNombre } : undefined
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el evento';
        this.loading = false;
        console.error('Error cargando evento:', err);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/eventos']);
  }

  editarEvento(): void {
    if (this.evento?.id) {
      this.router.navigate(['/eventos/editar', this.evento.id]);
    }
  }

  inscribirseEvento(): void {
    // TODO: Implementar lógica de inscripción
    alert('Funcionalidad de inscripción en desarrollo');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'PENDIENTE':
        return 'estado-pendiente';
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

  compartirEvento(): void {
    if (navigator.share) {
      navigator.share({
        title: this.evento?.nombre,
        text: this.evento?.descripcion,
        url: window.location.href
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  }

  marcarFavorito(): void {
    // TODO: Implementar lógica de favoritos
    alert('Funcionalidad de favoritos en desarrollo');
  }
}