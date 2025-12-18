import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../../services/evento.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ParticipanteAsistencia {
  usuarioId: number;
  nombreUsuario: string;
  asistio: boolean;
}

@Component({
  selector: 'app-planilla-asistencia',
  imports: [FormsModule, CommonModule],
  templateUrl: './planilla-asistencia.html',
  styleUrl: './planilla-asistencia.css'
})
export class PlanillaAsistencia implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly eventoService = inject(EventoService);
  private readonly authService = inject(AuthService);

  eventoId!: number;
  nombreEvento: string = '';
  participantes: ParticipanteAsistencia[] = [];
  loading: boolean = false;
  guardando: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    // Obtener el ID del evento desde la ruta
    this.route.params.subscribe(params => {
      this.eventoId = +params['id'];
      if (this.eventoId) {
        this.cargarEvento();
        this.cargarAsistencias();
      }
    });
  }

  cargarEvento(): void {
    this.eventoService.getEventoById(this.eventoId).subscribe({
      next: (evento: any) => {
        this.nombreEvento = evento.nombre;
      },
      error: (err) => {
        console.error('Error cargando evento:', err);
        this.error = 'Error al cargar la información del evento';
      }
    });
  }

  cargarAsistencias(): void {
    this.loading = true;
    this.error = null;

    this.eventoService.obtenerAsistenciasEvento(this.eventoId).subscribe({
      next: (response: any) => {
        this.participantes = response.usuariosAsistencias
          .map((item: any) => ({
            usuarioId: item.usuarioId,
            nombreUsuario: item.nombreUsuario,
            asistio: item.asistio
          }))
          .sort((a: ParticipanteAsistencia, b: ParticipanteAsistencia) =>
            a.nombreUsuario.localeCompare(b.nombreUsuario, 'es', { sensitivity: 'base' })
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

  marcarTodos(asistieron: boolean): void {
    this.participantes.forEach(p => p.asistio = asistieron);
  }

  guardarAsistencias(): void {
    if (this.guardando) return;

    this.guardando = true;
    this.error = null;

    // Preparar el DTO según el formato esperado por el backend
    const planillaRequest = {
      eventoId: this.eventoId,
      usuariosAsistencias: this.participantes.map(p => ({
        usuarioId: p.usuarioId,
        asistio: p.asistio
      }))
    };

    // Enviar el objeto completo al backend
    this.eventoService.guardarAsistenciasEvento(planillaRequest).subscribe({
      next: (response: any) => {
        this.guardando = false;
        alert('✅ Asistencias guardadas exitosamente');
        // Recargar para obtener el estado actualizado
        this.cargarAsistencias();
      },
      error: (err) => {
        console.error('Error guardando asistencias:', err);
        this.error = 'Error al guardar las asistencias';
        this.guardando = false;
        alert('❌ Error al guardar las asistencias. Por favor, intenta nuevamente.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/panel-organizador']);
  }

  get totalParticipantes(): number {
    return this.participantes.length;
  }

  get totalPresentes(): number {
    return this.participantes.filter(p => p.asistio).length;
  }

  get totalAusentes(): number {
    return this.participantes.filter(p => !p.asistio).length;
  }
}