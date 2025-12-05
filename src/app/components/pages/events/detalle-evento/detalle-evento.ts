import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../services/evento.service';
import { Evento } from '../../../../models/entities/Evento';
import { TipoEventoPipe } from '../../../../pipes/tipo-evento.pipe';
import { AuthService } from '../../../../services/auth.service';
import { Usuario } from '../../../../models/entities/Usuario';
import { PagoService } from '../../../../services/pago.service';
import { PagoRequest } from '../../../../models/dtos/pagos/PagoRequest';
import { DonacionService } from '../../../../services/donacion.service';
import { FormsModule } from '@angular/forms';
import { MapaDetalleEvento } from '../../../shared/mapa-detalle-evento/mapa-detalle-evento';

@Component({
  selector: 'app-detalle-evento',
  imports: [CommonModule, TipoEventoPipe, FormsModule, MapaDetalleEvento],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css'
})
export class DetalleEvento implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly pagoService = inject(PagoService);
  private readonly donacionService = inject(DonacionService);

  evento: Evento | null = null;
  loading: boolean = true;
  error: string | null = null;
  usuarioLogeado: Usuario | null = null;

  // INSCRIPCION
  estaInscripto: boolean = false;
  procesandoInscripcion: boolean = false;
  mostrarModalCancelacion: boolean = false;
  mostrarModalConfirmacionPago: boolean = false;

  // PAGOS
  procesandoPago = false;
  yaPago = false;

  // DONACIONES
  mostrarModalDonacion: boolean = false;
  mensajeDonacion: string = '';
  montoDonacion: number | null = null;
  procesandoDonacion: boolean = false;
  mostrarModalCancelarDonacion: boolean = false;

  ngOnInit(): void {
    this.loadUsuarioLogeado();
    this.verificarPago();
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
        // Si ya cargamos el evento, verificar inscripción Y pago
        if (this.evento?.id && this.usuarioLogeado?.id) {
          this.verificarInscripcion();
          this.verificarPago();
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
          latitud: data.latitud,
          longitud: data.longitud,
          horaInicio: data.horaInicio.toString(),
          horaFin: data.horaFin.toString(),
          puntosAsistencia: data.puntosAsistencia,
          costoInterno: data.costoInterno ? Number(data.costoInterno) : undefined,
          costoInscripcion: data.costoInscripcion ? Number(data.costoInscripcion) : undefined,
          organizadorId: data.organizadorId,
          organizador: data.organizadorNombre ? {
            id: data.organizadorId,
            nombre: data.organizadorNombre,
            apellido: data.organizadorApellido,
            email: data.organizadorEmail,
            rutaImg: data.organizadorRutaImg
          } : undefined,
          provinciaId: data.provinciaId,
          sponsorId: data.sponsorId,
          provincia: data.provinciaNombre ? { id: data.provinciaId, nombre: data.provinciaNombre } : undefined,
          sponsor: data.sponsorNombre ? {
            id: data.sponsorId,
            nombre: data.sponsorNombre,
            rutaImg1: data.sponsorRutaImg1,
            rutaImg2: data.sponsorRutaImg2,
            linkDominio: data.sponsorLinkDominio
          } : undefined,
        };

        this.loading = false;
        // Verificar inscripción Y pago si el usuario ya está cargado
        if (this.usuarioLogeado?.id) {
          this.verificarInscripcion();
          this.verificarPago();
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

  verificarPago(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id) return;

    this.pagoService.verificarPago(this.usuarioLogeado.id, this.evento.id).subscribe({
      next: (yaPago) => {
        this.yaPago = yaPago;
        // Si ya pagó pero no está inscripto, inscribir automáticamente
        if (yaPago && !this.estaInscripto) {
          this.inscribirseAutomaticamente();
        }
      },
      error: (err) => {
        console.error('Error verificando pago:', err);
        this.yaPago = false;
      }
    });
  }

  inscribirseAutomaticamente(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id) return;

    this.eventoService.inscribirseEvento(this.usuarioLogeado.id, this.evento.id).subscribe({
      next: () => {
        this.estaInscripto = true;
        console.log('Inscripción completada automáticamente tras pago aprobado');
      },
      error: (err) => {
        console.error('Error al inscribirse automáticamente:', err);
        // Si falla la inscripción automática, no bloqueamos, el usuario podrá intentar manualmente
      }
    });
  }

  inscribirseEvento(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id || this.procesandoInscripcion) return;

    // Si el evento tiene costo, redirigir a MercadoPago
    if (this.tieneCostoInscripcion() && !this.yaPago) {
      this.abrirModalConfirmacionPago();
      return;
    }

    // Si no tiene costo o ya pagó, inscribir directamente
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

  procesarPago(): void {
    if (!this.evento?.id || !this.usuarioLogeado?.id || this.procesandoPago) return;

    this.procesandoPago = true;

    const pagoRequest: PagoRequest = {
      usuarioId: this.usuarioLogeado.id,
      eventoId: this.evento.id,
      tipoPago: 'INSCRIPCION',
      monto: this.evento.costoInscripcion || 0,
      descripcion: `Inscripción a ${this.evento.nombre}`
    };

    this.pagoService.crearPago(pagoRequest).subscribe({
      next: (response) => {
        // Redirigir a MercadoPago
        window.location.href = response.initPoint;
      },
      error: (err) => {
        this.procesandoPago = false;
        console.error('Error al crear el pago:', err);
        alert('❌ Error al procesar el pago. Por favor, intenta nuevamente.');
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

  abrirModalConfirmacionPago(): void {
    this.mostrarModalConfirmacionPago = true;
  }

  cerrarModalConfirmacionPago(): void {
    this.mostrarModalConfirmacionPago = false;
  }

  confirmarYProcesarPago(): void {
    this.cerrarModalConfirmacionPago();
    this.procesarPago();
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

  realizarDonacion(): void {
    this.mostrarModalDonacion = true;
    this.mensajeDonacion = '';
    this.montoDonacion = null;
  }

  cerrarModalDonacion(): void {
    if (this.procesandoDonacion) {
      return; // No permitir cerrar si está procesando
    }

    this.mostrarModalDonacion = false;
    this.mensajeDonacion = '';
    this.montoDonacion = null;
  }

  confirmarCierreDonacion(): void {
    if (this.procesandoDonacion) {
      return;
    }

    this.mostrarModalCancelarDonacion = true;
  }

  cerrarModalCancelarDonacion(): void {
    this.mostrarModalCancelarDonacion = false;
  }

  confirmarCancelacionDonacion(): void {
    this.mostrarModalCancelarDonacion = false;
    this.cerrarModalDonacion();
  }

  procesarDonacion(): void {
    if (!this.montoDonacion || this.montoDonacion <= 0 || !this.usuarioLogeado?.id || !this.evento?.id) {
      return;
    }

    this.procesandoDonacion = true;

    const donacionRequest: any = {
      usuarioId: this.usuarioLogeado.id,
      eventoId: this.evento.id,
      monto: this.montoDonacion,
      mensaje: this.mensajeDonacion || undefined
    };

    this.donacionService.crearDonacion(donacionRequest).subscribe({
      next: (response) => {
        this.procesandoDonacion = false;
        this.cerrarModalDonacion();

        // Redirigir a MercadoPago
        if (response.initPoint) {
          window.location.href = response.initPoint;
        } else {
          alert('Error: No se recibió la URL de pago');
        }
      },
      error: (err) => {
        this.procesandoDonacion = false;
        console.error('Error al procesar donación:', err);
        alert('Lo sentimos, ha ocurrido un error al procesar tu donación. Por favor, intenta nuevamente.');
      }
    });
  }

  validarMontoDonacion(): boolean {
    return this.montoDonacion !== null && this.montoDonacion > 0;
  }

}