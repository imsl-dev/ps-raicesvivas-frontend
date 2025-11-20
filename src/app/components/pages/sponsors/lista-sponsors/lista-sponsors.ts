import { Component, inject, OnInit } from '@angular/core';
import { Sponsor } from '../../../../models/entities/Sponsor';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SponsorService } from '../../../../services/sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-sponsors',
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-sponsors.html',
  styleUrl: './lista-sponsors.css'
})
export class ListaSponsors implements OnInit {
  private readonly service = inject(SponsorService);
  private readonly router = inject(Router);
  sponsors: Sponsor[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadSponsors();
  }

  loadSponsors(): void {
    this.loading = true;
    this.error = null;

    this.service.getSponsor().subscribe({
      next: (data) => {
        this.sponsors = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los sponsors';
        this.loading = false;
        console.error('Error cargando sponsors:', err);
      }
    });
  }

  get filteredSponsors(): Sponsor[] {
    if (!this.searchTerm) {
      return this.sponsors;
    }

    return this.sponsors.filter(sponsor =>
      sponsor.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteSponsor(id: number | undefined): void {
    if (!id) return;

    if (confirm('¿Está seguro de que desea eliminar este sponsor?')) {
      this.service.deleteSponsor(id).subscribe({
        next: () => {
          this.sponsors = this.sponsors.filter(s => s.id !== id);
          alert('Sponsor eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar el sponsor:', err);
          alert('Error al eliminar el sponsor. Por favor, intente nuevamente.');
        }
      });
    }
  }

  editSponsor(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/sponsors/editar', id]);
  }

  viewDetails(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/sponsors/ver', id]);
  }

  nuevoSponsor(): void {
    this.router.navigate(['/sponsors/nuevo']);
  }
}
