import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../models/entities/Usuario';
import { AuthService } from '../../../../services/auth.service';
import { GestionRoles } from './gestion-roles/gestion-roles';
import { GestionPeticiones } from "./gestion-peticiones/gestion-peticiones";
import { GestionCanjeables } from './gestion-canjeables/gestion-canjeables';
import { ReportesAdmin } from './reportes-admin/reportes-admin';
import { ListaSponsors } from '../../sponsors/lista-sponsors/lista-sponsors';


type MenuOption = 'peticiones' | 'permisos' | 'canjeables' | 'reportes' | 'sponsors'

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, GestionPeticiones, GestionRoles, GestionCanjeables, ReportesAdmin, ListaSponsors],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit {
  private readonly authService = inject(AuthService);

  usuarioLogeado: Usuario | null = null;
  selectedOption: MenuOption = 'peticiones';
  mostrarSidebar: boolean = false;

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
}
