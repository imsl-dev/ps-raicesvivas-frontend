import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode';
import { Canjeable } from '../../../models/entities/Canjeable';
import { Sponsor } from '../../../models/entities/Sponsor';


export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  puntos: number;
  canjeables: Canjeable[];
}

@Component({
  selector: 'app-shop',
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda-canjeables.html',
  styleUrl: './tienda-canjeables.css'
})
export class TiendaCanjeables implements OnInit {
  loading: boolean = false;
  usuarioLogeado: Usuario | null = null;
  canjeablesDisponibles: Canjeable[] = [];
  sponsors: Sponsor[] = [];

  // Filtros
  filtroSponsor: string = 'TODOS';

  // QR Code expansion
  expandedCanjeableId: number | null = null;
  qrCodeDataUrl: string = '';
  generatingQR: boolean = false;

  ngOnInit(): void {
    this.loadUsuario();
    this.loadCanjeablesDisponibles();
    this.loadSponsors();
  }

  loadUsuario(): void {
    this.loading = true;

    // TODO: Replace with actual API call
    // this.authService.obtenerUsuarioLogueado().subscribe({
    //   next: (data) => {
    //     this.usuarioLogeado = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando usuario:', err);
    //     this.loading = false;
    //   }
    // });

    // Mock data
    setTimeout(() => {
      this.usuarioLogeado = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        puntos: 250,
        canjeables: [
          {
            id: 1,
            nombre: '20% de descuento en WaffleHouse',
            sponsorId: 1,
            url: 'https://wafflehouse.com/promo/20off',
            costoPuntos: 100,
            validoHasta: '2025-12-31T23:59:59',
            sponsor: { id: 1, nombre: 'WaffleHouse' }
          },
          {
            id: 2,
            nombre: 'Cupón de $500 en Tienda Natural',
            sponsorId: 2,
            url: 'https://tiendanatural.com/cupon/500',
            costoPuntos: 150,
            validoHasta: '2025-11-30T23:59:59',
            sponsor: { id: 2, nombre: 'Tienda Natural' }
          }
        ]
      };
      this.loading = false;
    }, 500);
  }

  loadCanjeablesDisponibles(): void {
    // TODO: Replace with actual API call
    // this.canjeableService.getAll().subscribe({
    //   next: (data) => {
    //     this.canjeablesDisponibles = data;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando canjeables:', err);
    //   }
    // });

    // Mock data
    setTimeout(() => {
      this.canjeablesDisponibles = [
        {
          id: 3,
          nombre: '15% de descuento en EcoMercado',
          sponsorId: 3,
          url: 'https://ecomercado.com/promo/15off',
          costoPuntos: 80,
          validoHasta: '2025-12-15T23:59:59',
          sponsor: { id: 3, nombre: 'EcoMercado Local' }
        },
        {
          id: 4,
          nombre: 'Producto gratis en Semillas Orgánicas',
          sponsorId: 4,
          url: 'https://semillasorganicas.com/gratis',
          costoPuntos: 200,
          validoHasta: '2026-01-31T23:59:59',
          sponsor: { id: 4, nombre: 'Semillas Orgánicas SA' }
        },
        {
          id: 5,
          nombre: '2x1 en productos seleccionados',
          sponsorId: 3,
          url: 'https://ecomercado.com/2x1',
          costoPuntos: 120,
          validoHasta: '2025-12-20T23:59:59',
          sponsor: { id: 3, nombre: 'EcoMercado Local' }
        }
      ];
    }, 500);
  }

  loadSponsors(): void {
    // TODO: Replace with actual API call
    // this.sponsorService.getAll().subscribe({
    //   next: (data) => {
    //     this.sponsors = data;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando sponsors:', err);
    //   }
    // });

    // Mock data
    setTimeout(() => {
      this.sponsors = [
        { id: 1, nombre: 'WaffleHouse' },
        { id: 2, nombre: 'Tienda Natural' },
        { id: 3, nombre: 'EcoMercado Local' },
        { id: 4, nombre: 'Semillas Orgánicas SA' },
        { id: 5, nombre: 'Cooperativa Verde' }
      ];
    }, 500);
  }

  get canjeablesUsuario(): Canjeable[] {
    return this.usuarioLogeado?.canjeables || [];
  }

  get canjeablesFiltrados(): Canjeable[] {
    if (this.filtroSponsor === 'TODOS') {
      return this.canjeablesDisponibles;
    }
    return this.canjeablesDisponibles.filter(
      c => c.sponsorId.toString() === this.filtroSponsor
    );
  }

  async toggleQRCode(canjeable: Canjeable): Promise<void> {
    if (this.expandedCanjeableId === canjeable.id) {
      // Collapse
      this.expandedCanjeableId = null;
      this.qrCodeDataUrl = '';
    } else {
      // Expand and generate QR
      this.expandedCanjeableId = canjeable.id || null;
      this.generatingQR = true;

      try {
        this.qrCodeDataUrl = await QRCode.toDataURL(canjeable.url!, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } catch (err) {
        console.error('Error generando QR:', err);
        alert('Error al generar el código QR');
      } finally {
        this.generatingQR = false;
      }
    }
  }

  isExpanded(canjeableId: number | undefined): boolean {
    return this.expandedCanjeableId === canjeableId;
  }

  canjearCupon(canjeable: Canjeable): void {
    if (!this.usuarioLogeado || !canjeable.id) return;

    if (!confirm('¿Está seguro que desea canjear este cupón? Esta acción no se puede deshacer.')) {
      return;
    }

    console.log('Canjear cupón:', canjeable.id);

    // TODO: Replace with actual API call
    // this.canjeableService.canjear(this.usuarioLogeado.id, canjeable.id).subscribe({
    //   next: () => {
    //     // Remove from user's canjeables
    //     this.usuarioLogeado!.canjeables = this.usuarioLogeado!.canjeables.filter(
    //       c => c.id !== canjeable.id
    //     );
    //     this.expandedCanjeableId = null;
    //     this.qrCodeDataUrl = '';
    //     alert('Cupón canjeado exitosamente');
    //   },
    //   error: (err) => {
    //     console.error('Error canjeando cupón:', err);
    //     alert('Error al canjear el cupón');
    //   }
    // });

    // Simulate API call
    setTimeout(() => {
      this.usuarioLogeado!.canjeables = this.usuarioLogeado!.canjeables.filter(
        c => c.id !== canjeable.id
      );
      this.expandedCanjeableId = null;
      this.qrCodeDataUrl = '';
      alert('Cupón canjeado exitosamente');
    }, 500);
  }

  comprarCanjeable(canjeable: Canjeable): void {
    if (!this.usuarioLogeado) return;

    if (this.usuarioLogeado.puntos < canjeable.costoPuntos) {
      alert('No tienes suficientes puntos para comprar este canjeable');
      return;
    }

    if (!confirm(`¿Deseas comprar "${canjeable.nombre}" por ${canjeable.costoPuntos} puntos?`)) {
      return;
    }

    console.log('Comprar canjeable:', canjeable.id);

    // TODO: Replace with actual API call
    // this.canjeableService.comprar(this.usuarioLogeado.id, canjeable.id).subscribe({
    //   next: (response) => {
    //     this.usuarioLogeado!.puntos -= canjeable.costoPuntos;
    //     this.usuarioLogeado!.canjeables.push(canjeable);
    //     this.canjeablesDisponibles = this.canjeablesDisponibles.filter(
    //       c => c.id !== canjeable.id
    //     );
    //     alert('Canjeable comprado exitosamente');
    //   },
    //   error: (err) => {
    //     console.error('Error comprando canjeable:', err);
    //     alert('Error al comprar el canjeable');
    //   }
    // });

    // Simulate API call
    setTimeout(() => {
      this.usuarioLogeado!.puntos -= canjeable.costoPuntos;
      this.usuarioLogeado!.canjeables.push({ ...canjeable });
      this.canjeablesDisponibles = this.canjeablesDisponibles.filter(
        c => c.id !== canjeable.id
      );
      alert('Canjeable comprado exitosamente');
    }, 500);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  limpiarFiltros(): void {
    this.filtroSponsor = 'TODOS';
  }

  puedeComprar(canjeable: Canjeable): boolean {
    return (this.usuarioLogeado?.puntos || 0) >= canjeable.costoPuntos;
  }
}