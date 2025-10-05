import { Component, OnInit } from '@angular/core';
import { Sponsor } from '../../../../models/entities/Sponsor';
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-sponsors',
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-sponsors.html',
  styleUrl: './lista-sponsors.css'
})
export class ListaSponsors implements OnInit {
  sponsors: Sponsor[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadSponsors();
  }

  loadSponsors(): void {
    this.loading = true;
    this.error = null;

    // Aquí llamarías a tu servicio para obtener los sponsors
    // this.sponsorService.obtenerSponsors().subscribe({
    //   next: (data) => {
    //     this.sponsors = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Error al cargar los sponsors';
    //     this.loading = false;
    //   }
    // });

    // Datos de ejemplo para demostración
    setTimeout(() => {
      this.sponsors = [
        {
          id: 1,
          nombre: 'Sponsor Ejemplo 1',
          rutaImg1: 'https://via.placeholder.com/300x200',
          rutaImg2: 'https://via.placeholder.com/300x200'
        },
        {
          id: 2,
          nombre: 'Sponsor Ejemplo 2',
          rutaImg1: 'https://via.placeholder.com/300x200',
          rutaImg2: undefined
        },
        {
          id: 3,
          nombre: 'Sponsor Ejemplo 3',
          rutaImg1: undefined,
          rutaImg2: undefined
        }
      ];
      this.loading = false;
    }, 1000);
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
      // Aquí llamarías a tu servicio para eliminar
      // this.sponsorService.eliminarSponsor(id).subscribe({
      //   next: () => {
      //     this.sponsors = this.sponsors.filter(s => s.id !== id);
      //   },
      //   error: (err) => {
      //     alert('Error al eliminar el sponsor');
      //   }
      // });

      // Simulación de eliminación
      this.sponsors = this.sponsors.filter(s => s.id !== id);
    }
  }

  editSponsor(id: number | undefined): void {
    if (!id) return;
    // Aquí navegarías al formulario de edición
    console.log('Editar sponsor:', id);
    // this.router.navigate(['/sponsors/editar', id]);
  }

  viewDetails(id: number | undefined): void {
    if (!id) return;
    // Aquí navegarías a la página de detalles
    console.log('Ver detalles del sponsor:', id);
    // this.router.navigate(['/sponsors/detalle', id]);
  }
}
