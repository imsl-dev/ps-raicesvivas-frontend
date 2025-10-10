import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SponsorService } from '../../../../services/sponsor.service';
import { HttpService } from '../../../../services/http.service';
import { Evento } from '../../../../models/entities/Evento';
import { Sponsor } from '../../../../models/entities/Sponsor';
import { Provincia } from '../../../../models/entities/auxiliares/Provincia';
import { TipoEvento, EstadoEvento } from '../../../../models/enums/Enums';
import { AuthService } from '../../../../services/auth.service';
import { EventoService } from '../../../../services/evento.service';

@Component({
  selector: 'app-nuevo-evento',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
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

  // Mostrar solo CANCELADO en modo edición
  estadosEventoEdicion = [EstadoEvento.CANCELADO];
  mostrarCampoEstado: boolean = false;

  eventoId: number | null = null;
  eventoForm!: FormGroup;
  imagenPreview: string | null = null;

  // Datos para los selects
  sponsors: Sponsor[] = [];
  provincias: Provincia[] = [];
  tiposEvento = Object.values(TipoEvento);
  estadosEvento = Object.values(EstadoEvento);

  constructor() { }

  get tituloFormulario(): string {
    return this.eventoId ? 'Modificar Evento' : 'Crear Nuevo Evento';
  }

  ngOnInit(): void {
    this.initForm();
    this.loadSelectData();

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.eventoId = +id;
        this.loadEvento(id);
      }
    });
  }

  initForm(): void {
    this.eventoForm = this.fb.group({
      tipo: ['', Validators.required],
      estado: [EstadoEvento.PENDIENTE],
      provinciaId: ['', Validators.required],
      sponsorId: [''],
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: [''],
      rutaImg: [''],
      direccion: ['', Validators.maxLength(500)],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      puntosAsistencia: [0, [Validators.min(0)]],
      costoInterno: [0, [Validators.min(0)]],
      costoInscripcion: [0, [Validators.min(0)]]
    }, { validators: this.validarFechas });
  }

  validarFechas(formGroup: FormGroup): { [key: string]: any } | null {
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

  loadSelectData(): void {
    this.sponsorService.getSponsor().subscribe({
      next: (data) => this.sponsors = data,
      error: (err) => console.error('Error cargando sponsors:', err)
    });

    this.httpService.getProvincias().subscribe({
      next: (data) => this.provincias = data,
      error: (err) => console.error('Error cargando provincias:', err)
    });
  }

  loadEvento(id: number): void {
    this.eventoService.getEventoById(id).subscribe({
      next: (evento) => {
        this.mostrarCampoEstado = true; // Mostrar campo estado en edición
        this.eventoForm.patchValue({
          tipo: evento.tipo,
          estado: evento.estado,
          provinciaId: evento.provincia?.id || '',
          sponsorId: evento.sponsor?.id || '',
          nombre: evento.nombre,
          descripcion: evento.descripcion || '',
          rutaImg: evento.rutaImg || '',
          direccion: evento.direccion || '',
          horaInicio: this.formatDateForInput(evento.horaInicio),
          horaFin: this.formatDateForInput(evento.horaFin),
          puntosAsistencia: evento.puntosAsistencia || 0,
          costoInterno: evento.costoInterno || 0,
          costoInscripcion: evento.costoInscripcion || 0
        });
        this.imagenPreview = evento.rutaImg || null;
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

      const eventoData: Evento = {
        id: this.eventoId || undefined,
        tipo: formValue.tipo,
        estado: formValue.estado,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        rutaImg: formValue.rutaImg,
        direccion: formValue.direccion,
        horaInicio: new Date(formValue.horaInicio).toISOString(),
        horaFin: new Date(formValue.horaFin).toISOString(),
        puntosAsistencia: formValue.puntosAsistencia,
        costoInterno: formValue.costoInterno,
        costoInscripcion: formValue.costoInscripcion,
        provincia: { id: formValue.provinciaId } as Provincia,
        sponsor: formValue.sponsorId ? { id: formValue.sponsorId } as Sponsor : undefined
      };

      const request = this.eventoId
        ? this.eventoService.putEvento(eventoData)
        : this.eventoService.postEvento(eventoData);

      request.subscribe({
        next: (response) => {
          const mensaje = this.eventoId ? 'actualizado' : 'creado';
          alert(`Evento ${mensaje} exitosamente`);
          this.router.navigate(['/eventos']);
        },
        error: (error) => {
          console.error('Error al guardar el evento:', error);
          alert('Error al guardar el evento. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.markFormGroupTouched(this.eventoForm);
    }
  }

  resetForm(): void {
    this.eventoForm.reset({
      estado: EstadoEvento.PENDIENTE,
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
}