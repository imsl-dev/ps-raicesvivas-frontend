import { Component, inject, OnInit } from '@angular/core';
import { Sponsor } from '../../../../../models/entities/Sponsor';
import { Router } from '@angular/router';
import { Canjeable } from '../../../../../models/entities/Canjeable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SponsorService } from '../../../../../services/sponsor.service';
import { CanjeableService } from '../../../../../services/canjeable.service';
import { CanjeableFormAdmin } from '../canjeable-form-admin/canjeable-form-admin';


export type CanjeableAction = 'crear' | 'editar' | 'ver';

export interface CanjeableEvent {
  action: CanjeableAction;
  canjeableId?: number;
}

@Component({
  selector: 'app-gestion-canjeables',
  imports: [FormsModule, CommonModule, CanjeableFormAdmin],
  templateUrl: './gestion-canjeables.html',
  styleUrl: './gestion-canjeables.css'
})
export class GestionCanjeables implements OnInit {
  private readonly router = inject(Router);
  private readonly sponsorService = inject(SponsorService);
  private readonly canjeableService = inject(CanjeableService);

  loading: boolean = false;
  sponsors: Sponsor[] = [];
  canjeables: Canjeable[] = [];
  canjeablesFiltrados: Canjeable[] = [];

  // Form state
  showCanjeableForm: boolean = false;
  canjeableFormAction: CanjeableAction = 'crear';
  canjeableFormId: number | null = null;

  // Filtros
  searchTerm: string = '';
  filtroEstado: 'activos' | 'todos' = 'activos';
  filtroVigencia: 'vigentes' | 'todos' = 'vigentes';
  filtroSponsor: number | null = null;

  // Modales de confirmación
  showDeleteModal: boolean = false;
  canjeableToDelete: Canjeable | null = null;

  showSuccessModal: boolean = false;
  successMessage: string = '';
  successAction: string = ''; // 'crear', 'editar', 'eliminar'

  ngOnInit(): void {
    this.loadSponsors();
    this.loadCanjeables();
  }

  loadSponsors(): void {
    this.sponsorService.getSponsor().subscribe({
      next: (data) => {
        this.sponsors = data;
      },
      error: (err) => {
        console.error('Error cargando sponsors:', err);
      }
    });
  }

  loadCanjeables(): void {
    this.loading = true;

    // Usar endpoint /all para obtener todos los canjeables
    this.canjeableService.getAllCanjeablesAdmin().subscribe({
      next: (data) => {
        this.canjeables = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando canjeables:', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.canjeables];

    // Filtro de búsqueda por nombre
    if (this.searchTerm) {
      filtrados = filtrados.filter(c =>
        c.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro de estado (activo/inactivo)
    if (this.filtroEstado === 'activos') {
      filtrados = filtrados.filter(c => c.activo === true);
    }

    // Filtro de vigencia (vencido o no)
    if (this.filtroVigencia === 'vigentes') {
      filtrados = filtrados.filter(c => !this.estaVencido(c));
    }

    // Filtro de sponsor
    if (this.filtroSponsor) {
      filtrados = filtrados.filter(c => c.sponsorId === this.filtroSponsor);
    }

    this.canjeablesFiltrados = filtrados;
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(): void {
    this.aplicarFiltros();
  }

  onFiltroVigenciaChange(): void {
    this.aplicarFiltros();
  }

  onFiltroSponsorChange(): void {
    this.aplicarFiltros();
  }

  estaVencido(canjeable: Canjeable): boolean {
    if (!canjeable.validoHasta) return false;
    const fechaVencimiento = new Date(canjeable.validoHasta);
    const ahora = new Date();
    return fechaVencimiento < ahora;
  }

  puedeEditarEliminar(canjeable: Canjeable): boolean {
    // Solo se puede editar/eliminar si NO está vencido
    return !this.estaVencido(canjeable);
  }

  nuevoCanjeable(): void {
    this.canjeableFormAction = 'crear';
    this.canjeableFormId = null;
    this.showCanjeableForm = true;
  }

  editarCanjeable(id: number | undefined): void {
    if (!id) return;
    this.canjeableFormAction = 'editar';
    this.canjeableFormId = id;
    this.showCanjeableForm = true;
  }

  verCanjeable(id: number | undefined): void {
    if (!id) return;
    this.canjeableFormAction = 'ver';
    this.canjeableFormId = id;
    this.showCanjeableForm = true;
  }

  abrirModalEliminar(canjeable: Canjeable): void {
    this.canjeableToDelete = canjeable;
    this.showDeleteModal = true;
  }

  cerrarModalEliminar(): void {
    this.showDeleteModal = false;
    this.canjeableToDelete = null;
  }

  cerrarModalExito(): void {
    this.showSuccessModal = false;
    this.successMessage = '';
    this.successAction = '';
  }

  confirmarEliminar(): void {
    if (!this.canjeableToDelete || !this.canjeableToDelete.id) return;

    this.canjeableService.deleteCanjeable(this.canjeableToDelete.id).subscribe({
      next: () => {
        this.cerrarModalEliminar();

        // Mostrar modal de éxito
        this.successAction = 'eliminar';
        this.successMessage = '¡Canjeable eliminado exitosamente!';
        this.showSuccessModal = true;

        // Recargar lista después de un breve delay
        setTimeout(() => {
          this.loadCanjeables();
        }, 300);
      },
      error: (err) => {
        console.error('Error al eliminar canjeable:', err);
        alert(err.error?.message || 'Error al eliminar el canjeable');
        this.cerrarModalEliminar();
      }
    });
  }

  handleCanjeableFormClose(result: { saved: boolean, action?: string }): void {
    this.showCanjeableForm = false;

    if (result.saved && result.action) {
      // Mostrar modal de éxito
      this.successAction = result.action;

      if (result.action === 'crear') {
        this.successMessage = '¡Canjeable creado exitosamente!';
      } else if (result.action === 'editar') {
        this.successMessage = '¡Canjeable actualizado exitosamente!';
      }

      this.showSuccessModal = true;

      // Recargar lista después de cerrar el modal
      setTimeout(() => {
        this.loadCanjeables();
      }, 300);
    }

    this.canjeableFormId = null;
  }

  getSponsorNombre(sponsorId: number): string {
    const sponsor = this.sponsors.find(s => s.id === sponsorId);
    return sponsor?.nombre || 'Sponsor desconocido';
  }
}