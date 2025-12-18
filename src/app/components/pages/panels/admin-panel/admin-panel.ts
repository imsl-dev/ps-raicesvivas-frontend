import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../models/entities/Usuario';
import { AuthService } from '../../../../services/auth.service';

import { GestionPeticiones } from "./gestion-peticiones/gestion-peticiones";
import { GestionCanjeables } from './gestion-canjeables/gestion-canjeables';
import { ReportesAdmin } from './reportes-admin/reportes-admin';
import { ListaSponsors, SponsorEvent, SponsorAction } from '../../sponsors/lista-sponsors/lista-sponsors';
import { SponsorFormAdmin } from './sponsor-form-admin/sponsor-form-admin';
import { GestionRoles } from './gestion-roles/gestion-roles';

type MenuOption = 'peticiones' | 'permisos' | 'canjeables' | 'reportes' | 'sponsors'

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, GestionPeticiones, GestionRoles, GestionCanjeables, ReportesAdmin, ListaSponsors, SponsorFormAdmin],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit {
  private readonly authService = inject(AuthService);

  usuarioLogeado: Usuario | null = null;
  selectedOption: MenuOption = 'peticiones';
  mostrarSidebar: boolean = false;

  // Sponsor form state
  showSponsorForm: boolean = false;
  sponsorFormAction: SponsorAction = 'crear';
  sponsorFormId: number | null = null;

  ngOnInit(): void {
    this.loadUsuarioLogeado();
  }

  loadUsuarioLogeado(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (data) => {
        this.usuarioLogeado = data;
      },
      error: (err) => {
        console.error('Error cargando usuario logeado:', err);
      }
    });
  }

  selectOption(option: MenuOption): void {
    this.selectedOption = option;
    // Reset sponsor form state when changing menu options
    this.showSponsorForm = false;
    this.sponsorFormId = null;

    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth <= 992) {
      this.mostrarSidebar = false;
    }
  }

  toggleSidebar(): void {
    this.mostrarSidebar = !this.mostrarSidebar;
  }

  isSelected(option: MenuOption): boolean {
    return this.selectedOption === option;
  }

  // Sponsor management methods
  handleSponsorAction(event: SponsorEvent): void {
    this.sponsorFormAction = event.action;
    this.sponsorFormId = event.sponsorId || null;
    this.showSponsorForm = true;
  }

  handleSponsorFormClose(saved: boolean): void {
    this.showSponsorForm = false;
    this.sponsorFormId = null;

    // If saved, we might want to refresh the list
    // The list component will handle its own refresh if needed
  }
}
