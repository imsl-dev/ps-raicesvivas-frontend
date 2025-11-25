import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode';
import { Canjeable } from '../../../models/entities/Canjeable';
import { Sponsor } from '../../../models/entities/Sponsor';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/entities/Usuario';
import { CanjeableService } from '../../../services/canjeable.service';
import { SponsorService } from '../../../services/sponsor.service';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda-canjeables.html',
  styleUrl: './tienda-canjeables.css'
})
export class TiendaCanjeables implements OnInit {
  loading: boolean = false;
  usuarioLogeado: Usuario = {
    nombre: "",
    apellido: "",
    puntos: 200
  }
  canjeablesDisponibles: Canjeable[] = [];
  sponsors: Sponsor[] = [];

  constructor(
    private authService: AuthService,
    private canjeableService: CanjeableService,
    private sponsorService: SponsorService) { }

  // Filtros
  filtroSponsor: string = 'TODOS';

  // QR Code expansion
  expandedCanjeableId: number | null = null;
  qrCodeDataUrl: string = '';
  generatingQR: boolean = false;

  // Modal control for redeem
  showRedeemModal: boolean = false;
  pendingRedeemCanjeable: Canjeable | null = null;

  // Modal control for purchase
  showPurchaseModal: boolean = false;
  pendingPurchaseCanjeable: Canjeable | null = null;

  ngOnInit(): void {
    this.loadUsuario();
    this.loadCanjeablesDisponibles();
    this.loadSponsors();
  }

  loadUsuario(): void {
    this.loading = true;

    this.authService.refreshUsuario().subscribe({
      next: (data) => {
        this.usuarioLogeado = data;
        console.log("[Tienda Canjeables] User detected: ", this.usuarioLogeado);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.loading = false;
      }
    });
  }

  loadCanjeablesDisponibles(): void {
    this.canjeableService.getAllCanjeables().subscribe({
      next: (data: any) => {
        this.canjeablesDisponibles = data;
        console.log("[Tienda Canjeables] Canjeables disponibles: ", this.canjeablesDisponibles);
      },
      error: (err) => {
        console.error('Error cargando canjeables:', err);
      }
    });
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
      // Collapse - just close it without showing modal
      this.expandedCanjeableId = null;
      this.qrCodeDataUrl = '';
      return;
    }

    // Expanding - show confirmation modal
    this.pendingRedeemCanjeable = canjeable;
    this.showRedeemModal = true;
  }

  async confirmarCanje(): Promise<void> {
    if (!this.pendingRedeemCanjeable || !this.usuarioLogeado) return;

    const canjeable = this.pendingRedeemCanjeable;
    this.showRedeemModal = false;

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

      // Make API call to remove canjeable from user
      console.log('Canjear cupón:', canjeable.id);

      this.canjeableService.canjear(this.usuarioLogeado.id!, canjeable.id!).subscribe({
        next: () => {
          console.log('Cupón canjeado exitosamente en el backend');
        },
        error: (err) => {
          console.error('Error canjeando cupón:', err);
          alert('Error al canjear el cupón');
          // Revert the expansion
          this.expandedCanjeableId = null;
          this.qrCodeDataUrl = '';
        }
      });

    } catch (err) {
      console.error('Error generando QR:', err);
      alert('Error al generar el código QR');
    } finally {
      this.generatingQR = false;
      this.pendingRedeemCanjeable = null;
    }
  }

  cancelarCanje(): void {
    this.showRedeemModal = false;
    this.pendingRedeemCanjeable = null;
  }

  // Purchase Modal Methods
  mostrarModalCompra(canjeable: Canjeable): void {
    if (!this.usuarioLogeado) return;

    if (this.usuarioLogeado.puntos! < canjeable.costoPuntos) {
      alert('No tienes suficientes puntos para comprar este canjeable');
      return;
    }

    this.pendingPurchaseCanjeable = canjeable;
    this.showPurchaseModal = true;
  }

  confirmarCompra(): void {
    if (!this.pendingPurchaseCanjeable || !this.usuarioLogeado) return;

    const canjeable = this.pendingPurchaseCanjeable;
    this.showPurchaseModal = false;

    console.log('Comprar canjeable:', canjeable.id);

    this.canjeableService.comprar(this.usuarioLogeado.id!, canjeable.id!).subscribe({
      next: (response) => {
        // Refresh user from backend to get updated points and canjeables
        this.authService.refreshUsuario().subscribe({
          next: (updatedUser) => {
            this.usuarioLogeado = updatedUser;
            this.canjeablesDisponibles = this.canjeablesDisponibles.filter(
              c => c.id !== canjeable.id
            );
            alert('Cupón comprado');
          },
          error: (err) => {
            console.error('Error refrescando usuario:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error comprando canjeable:', err);
        alert('Ya tenés ese cupón disponible. Utilizalo antes de comprar otro');
      }
    });

    this.pendingPurchaseCanjeable = null;
  }

  cancelarCompra(): void {
    this.showPurchaseModal = false;
    this.pendingPurchaseCanjeable = null;
  }

  comprarCanjeable(canjeable: Canjeable): void {
    this.mostrarModalCompra(canjeable);
  }

  isExpanded(canjeableId: number | undefined): boolean {
    if (!canjeableId) return false;
    const result = this.expandedCanjeableId === canjeableId;
    return result;
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