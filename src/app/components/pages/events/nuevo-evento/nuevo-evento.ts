import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SponsorService } from '../../../../services/sponsor.service';
import { HttpService } from '../../../../services/http.service';
import { Sponsor } from '../../../../models/entities/Sponsor';
import { Provincia } from '../../../../models/entities/auxiliares/Provincia';
import { TipoEvento, EstadoEvento } from '../../../../models/enums/Enums';
import { AuthService } from '../../../../services/auth.service';
import { EventoService } from '../../../../services/evento.service';
import { T } from '@angular/cdk/keycodes';
import { TipoEventoPipe } from '../../../../pipes/tipo-evento.pipe';
import { MapaSelector } from '../../../shared/mapa-selector/mapa-selector';
import { CoordenadaResult, GeocodingService } from '../../../../services/geocoding.service';

@Component({
  selector: 'app-nuevo-evento',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TipoEventoPipe, MapaSelector],
  templateUrl: './nuevo-evento.html',
  styleUrl: './nuevo-evento.css'
})
export class NuevoEvento implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly sponsorService = inject(SponsorService);
  private readonly httpService = inject(HttpService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly geocodingService = inject(GeocodingService);


  organizadorId: number | null = null;

  // Mostrar solo CANCELADO en modo edición
  estadosEventoEdicion: EstadoEvento[] = [];
  mostrarCampoEstado: boolean = false;

  eventoId: number | null = null;
  eventoForm!: FormGroup;
  imagenPreview: string | null = null;

  // Datos para los selects
  sponsors: Sponsor[] = [];
  provincias: Provincia[] = [];
  tiposEvento = Object.values(TipoEvento).sort((a, b) => a.localeCompare(b));
  estadosEvento = Object.values(EstadoEvento);

  // Esta variable es para el caso en el que se haya creado un evento y el sponsor fuera inhabilitado luego.
  // De esta manera el sponsor que actualmente se encuentra inactivo se muestra igual en el select
  // Por regla de negocio, al momento de crear el evento ya se pudo haber "cerrado" el sponsor y por lo tanto no debería obligarte a desvincularlo del evento.
  sponsorInactivoEvento: Sponsor | null = null;

  // Mapa y coordenadas
  mostrarMapa: boolean = false;
  coordenadasMapa = { lat: 0, lng: 0 }; // Córdoba por defecto

  constructor() { }

  get tituloFormulario(): string {
    return this.eventoId ? 'Modificar Evento' : 'Crear Nuevo Evento';
  }

  ngOnInit(): void {
    this.initForm();

    // Primero cargar el usuario logueado
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (usuario) => {
        this.organizadorId = usuario.id || null;

        // Luego proceder con la carga del formulario
        this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
            this.eventoId = +id;
            this.loadSelectData(() => {
              this.loadEvento(id);
            });
          } else {
            this.loadSelectData();
          }
        });
      },
      error: (err) => {
        console.error('Error cargando usuario logueado:', err);
        alert('Error al cargar el usuario logueado');
      }
    });
  }

  initForm(): void {
    this.eventoForm = this.fb.nonNullable.group({
      tipo: ['', Validators.required],
      estado: EstadoEvento.PROXIMO,
      provinciaId: ['', Validators.required],
      sponsorId: '',
      organizadorId: [null],
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: '',
      rutaImg: '',
      direccion: ['', Validators.maxLength(500)],
      latitud: [null],
      longitud: [null],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      puntosAsistencia: [0, Validators.min(0)],
      costoInterno: [0, Validators.min(0)],
      costoInscripcion: [0, Validators.min(0)]
    }, {
      validators: this.validarFechas
    });
  }
  validarFechas(control: AbstractControl): { [key: string]: any } | null {
    const formGroup = control as FormGroup;
    const horaInicio = formGroup.get('horaInicio')?.value;
    const horaFin = formGroup.get('horaFin')?.value;

    if (!horaInicio || !horaFin) {
      return null;
    }

    const fechaInicio = new Date(horaInicio);
    const fechaFin = new Date(horaFin);
    const fechaActual = new Date();

    // Validar que la fecha de inicio sea posterior a la fecha actual
    if (fechaInicio <= fechaActual) {
      return { fechaInicioAnteriorActual: true };
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (fechaFin <= fechaInicio) {
      return { fechaFinAnteriorInicio: true };
    }

    // Validar que haya al menos 1 hora de diferencia
    const diferenciaHoras = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60);
    if (diferenciaHoras < 1) {
      return { diferenciaHorasMenor: true };
    }

    return null;
  }

  loadSelectData(callback?: () => void): void {
    let sponsorsLoaded = false;
    let provinciasLoaded = false;

    const checkIfAllLoaded = () => {
      if (sponsorsLoaded && provinciasLoaded && callback) {
        callback();
      }
    };

    this.sponsorService.getSponsor().subscribe({
      next: (data) => {
        this.sponsors = data;
        sponsorsLoaded = true;
        checkIfAllLoaded();
      },
      error: (err) => {
        console.error('Error cargando sponsors:', err);
        sponsorsLoaded = true;
        checkIfAllLoaded();
      }
    });

    this.httpService.getProvincias().subscribe({
      next: (data) => {
        this.provincias = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        provinciasLoaded = true;
        checkIfAllLoaded();
      },
      error: (err) => {
        console.error('Error cargando provincias:', err);
        provinciasLoaded = true;
        checkIfAllLoaded();
      }
    });
  }

  loadEvento(id: number): void {
    this.eventoService.getEventoById(id).subscribe({
      next: (evento) => {
        this.mostrarCampoEstado = true;

        // Cargar estado actual + CANCELADO
        this.estadosEventoEdicion =
          evento.estado === EstadoEvento.CANCELADO
            ? [EstadoEvento.CANCELADO]
            : [evento.estado, EstadoEvento.CANCELADO];

        // Verificar si el sponsor del evento está inactivo (no está en la lista)
        if (evento.sponsorId) {
          const sponsorEnLista = this.sponsors.find(s => s.id === evento.sponsorId);

          if (!sponsorEnLista) {
            // El sponsor está inactivo, obtenerlo directamente
            this.sponsorService.getSponsorById(evento.sponsorId).subscribe({
              next: (sponsorInactivo) => {
                this.sponsorInactivoEvento = sponsorInactivo;
                // Agregar el sponsor inactivo temporalmente a la lista
                this.sponsors = [sponsorInactivo, ...this.sponsors];
              },
              error: (err) => {
                console.error('Error cargando sponsor inactivo:', err);
              }
            });
          }
        }


        this.eventoForm.patchValue({
          tipo: evento.tipo,
          estado: evento.estado,
          provinciaId: evento.provinciaId || '',
          sponsorId: evento.sponsorId || '',
          organizadorId: evento.organizadorId,
          nombre: evento.nombre,
          descripcion: evento.descripcion || '',
          rutaImg: evento.rutaImg || '',
          direccion: evento.direccion || '',
          latitud: evento.latitud,
          longitud: evento.longitud,
          horaInicio: this.formatDateForInput(evento.horaInicio),
          horaFin: this.formatDateForInput(evento.horaFin),
          puntosAsistencia: evento.puntosAsistencia || 0,
          costoInterno: evento.costoInterno || 0,
          costoInscripcion: evento.costoInscripcion || 0
        });

        this.imagenPreview = evento.rutaImg || null;

        // Si tiene coordenadas, mostrar mapa y configurar posición
        if (evento.latitud && evento.longitud) {
          this.mostrarMapa = true;
          this.coordenadasMapa = { lat: evento.latitud, lng: evento.longitud };
        }

        setTimeout(() => {
          this.markFormGroupTouched(this.eventoForm);
        }, 100);
      },
      error: (err) => {
        console.error('Error cargando evento:', err);
        alert('Error al cargar los datos del evento');
      }
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.imagenPreview = result;
        this.eventoForm.patchValue({ rutaImg: result });
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagenPreview = null;
    this.eventoForm.patchValue({ rutaImg: '' });
  }

  volver(): void {
    this.router.navigate(['/eventos']);
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      const formValue = this.eventoForm.value;

      // Determinar el organizadorId
      let organizadorId: number;
      if (this.eventoId) {
        // Si estamos editando, mantener el organizadorId original
        organizadorId = formValue.organizadorId;
      } else {
        // Si estamos creando, usar el ID del usuario logueado
        if (!this.organizadorId) {
          alert('❌ Error: No se pudo obtener el usuario logueado');
          return;
        }
        organizadorId = this.organizadorId;
      }

      const eventoData: any = {
        id: this.eventoId || undefined,
        tipo: formValue.tipo,
        estado: formValue.estado,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        rutaImg: formValue.rutaImg,
        direccion: formValue.direccion,
        latitud: formValue.latitud,
        longitud: formValue.longitud,
        horaInicio: formValue.horaInicio,
        horaFin: formValue.horaFin,
        puntosAsistencia: formValue.puntosAsistencia,
        costoInterno: formValue.costoInterno,
        costoInscripcion: formValue.costoInscripcion,
        provinciaId: formValue.provinciaId,
        sponsorId: formValue.sponsorId || null,
        organizadorId: organizadorId
      };

      const request = this.eventoId
        ? this.eventoService.putEvento(eventoData)
        : this.eventoService.postEvento(eventoData);

      request.subscribe({
        next: (response) => {
          const mensaje = this.eventoId
            ? '✅ Evento modificado exitosamente'
            : '✅ Evento creado exitosamente';
          alert(mensaje);
          this.router.navigate(['/eventos']);
        },
        error: (err) => {
          console.error('Error al guardar evento:', err);
          alert('❌ Error al guardar el evento. Por favor, revisa los datos ingresados.');
        }
      });
    } else {
      this.markFormGroupTouched(this.eventoForm);
      alert('❌ Por favor completa todos los campos obligatorios correctamente');
    }
  }

  resetForm(): void {
    this.eventoForm.reset({
      estado: EstadoEvento.PROXIMO,
      puntosAsistencia: 0,
      costoInterno: 0,
      costoInscripcion: 0
    });
    this.imagenPreview = null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validaciones
  get tipo() { return this.eventoForm.get('tipo'); }
  get estado() { return this.eventoForm.get('estado'); }
  get provinciaId() { return this.eventoForm.get('provinciaId'); }
  get nombre() { return this.eventoForm.get('nombre'); }
  get direccion() { return this.eventoForm.get('direccion'); }
  get horaInicio() { return this.eventoForm.get('horaInicio'); }
  get horaFin() { return this.eventoForm.get('horaFin'); }
  get fechaInicioInvalida() {
    return this.eventoForm.errors?.['fechaInicioAnteriorActual'] &&
      (this.horaInicio?.touched || this.horaFin?.touched);
  }

  get fechaFinInvalida() {
    return this.eventoForm.errors?.['fechaFinAnteriorInicio'] &&
      (this.horaInicio?.touched || this.horaFin?.touched);
  }

  get diferenciaHorasInvalida() {
    return this.eventoForm.errors?.['diferenciaHorasMenor'] &&
      (this.horaInicio?.touched || this.horaFin?.touched);
  }



  toggleMapa(): void {
    this.mostrarMapa = !this.mostrarMapa;
  }

  onUbicacionCambiada(coords: { lat: number, lng: number }): void {
    if (coords.lat === 0 && coords.lng === 0) {
      // Limpiar coordenadas
      this.eventoForm.patchValue({
        latitud: null,
        longitud: null
      });
    } else {
      // Solo actualizar coordenadas, NO tocar la dirección
      this.eventoForm.patchValue({
        latitud: coords.lat,
        longitud: coords.lng
      });
    }
  }

}