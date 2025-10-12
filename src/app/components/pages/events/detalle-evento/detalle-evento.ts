import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../services/evento.service';
import { Evento } from '../../../../models/entities/Evento';
import { TipoEventoPipe } from '../../../../pipes/tipo-evento.pipe';
import { AuthService } from '../../../../services/auth.service';
import { Usuario } from '../../../../models/entities/Usuario';

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
  private readonly authService = inject(AuthService);

  evento: Evento | null = null;
  loading: boolean = true;
  error: string | null = null;
  usuarioLogeado: Usuario | null = null;
  estaInscripto: boolean = false;
  procesandoInscripcion: boolean = false;
  mostrarModalCancelacion: boolean = false;

  ngOnInit(): void {
    this.loadUsuarioLogeado();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvento(+id);
    } else {
      this.error = 'ID de evento no válido';
      this.loading = false;
    }
  }

  loadUsuarioLogeado(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (data) => {
        this.usuarioLogeado = data;
        // Si ya cargamos el evento, verificar inscripción
        if (this.evento?.id && this.usuarioLogeado?.id) {
          this.verificarInscripcion();
        }
      },
      error: (err) => {
        console.error('Error cargando usuario logeado:', err);
      }
    });
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
        // Verificar inscripción si el usuario ya está cargado
        if (this.usuarioLogeado?.id) {
          this.verificarInscripcion();
        }
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

  verificarInscripcion(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id) return;

    this.eventoService.validarInscripcion(this.usuarioLogeado.id, this.evento.id).subscribe({
      next: (inscripto) => {
        this.estaInscripto = inscripto;
      },
      error: (err) => {
        console.error('Error verificando inscripción:', err);
        this.estaInscripto = false;
      }
    });
  }

  inscribirseEvento(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id || this.procesandoInscripcion) return;

    this.procesandoInscripcion = true;

    this.eventoService.inscribirseEvento(this.usuarioLogeado.id, this.evento.id).subscribe({
      next: () => {
        this.estaInscripto = true;
        this.procesandoInscripcion = false;
        alert('✅ ¡Te has inscripto exitosamente al evento!');
      },
      error: (err) => {
        this.procesandoInscripcion = false;
        console.error('Error al inscribirse:', err);
        if (err.status === 409) {
          alert('⚠️ Ya estás inscripto a este evento');
        } else {
          alert('❌ Error al inscribirse. Por favor, intenta nuevamente.');
        }
      }
    });
  }

  abrirModalCancelacion(): void {
    this.mostrarModalCancelacion = true;
  }

  cerrarModalCancelacion(): void {
    this.mostrarModalCancelacion = false;
  }

  confirmarCancelacion(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id || this.procesandoInscripcion) return;

    this.procesandoInscripcion = true;

    this.eventoService.cancelarInscripcion(this.usuarioLogeado.id, this.evento.id).subscribe({
      next: () => {
        this.estaInscripto = false;
        this.procesandoInscripcion = false;
        this.cerrarModalCancelacion();
        alert('✅ Tu inscripción ha sido cancelada');
      },
      error: (err) => {
        this.procesandoInscripcion = false;
        console.error('Error al cancelar inscripción:', err);
        alert('❌ Error al cancelar la inscripción. Por favor, intenta nuevamente.');
      }
    });
  }

  tieneCostoInscripcion(): boolean {
    return this.evento?.costoInscripcion !== undefined &&
      this.evento?.costoInscripcion !== null &&
      this.evento?.costoInscripcion > 0;
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
      case 'PRÓXIMO':
        return 'estado-proximo';
      case 'EN CURSO':
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