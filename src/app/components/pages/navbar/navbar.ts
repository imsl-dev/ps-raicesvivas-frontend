import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Usuario } from '../../../models/entities/Usuario';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  usuarioLogeado: Usuario | null = null;
  mostrarSeccionPuntos: boolean = false;
  mostrarDropdownPerfil: boolean = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsuarioLogeado();
  }

  loadUsuarioLogeado(): void {
    this.authService.obtenerUsuarioLogueado().subscribe({
      next: (data) => {
        this.usuarioLogeado = data;
        // Mostrar sección de puntos solo para usuarios con rol USUARIO y puntos > 0
        this.mostrarSeccionPuntos = data?.rol === 'USUARIO' && (data?.puntos ?? 0) > 0;
      },
      error: (err) => {
        console.error('Error cargando usuario logeado:', err);
        this.mostrarSeccionPuntos = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // redirect to home
  }

  canjearPuntos(): void {
    alert('⚠️ Funcionalidad en desarrollo');
  }

  toggleDropdownPerfil(): void {
    this.mostrarDropdownPerfil = !this.mostrarDropdownPerfil;
  }

  cerrarDropdown(): void {
    this.mostrarDropdownPerfil = false;
  }

  editarPerfil(): void {
    this.cerrarDropdown();
    const idUsuarioLogueado = this.usuarioLogeado?.id || 0
    this.router.navigate([`/perfil/${idUsuarioLogueado}`]);
  }

  getImagenPerfil(): string {
    return this.usuarioLogeado?.rutaImg || 'https://ui-avatars.com/api/?name=' +
      (this.usuarioLogeado?.nombre || 'U') + '+' +
      (this.usuarioLogeado?.apellido || 'U') + '&background=28a745&color=fff&size=128';
  }

  esUsuario(): boolean {
    return this.usuarioLogeado?.rol === 'USUARIO';
  }

  esOrganizador(): boolean {
    return this.usuarioLogeado?.rol === 'ORGANIZADOR';
  }

  esAdmin(): boolean {
    return this.usuarioLogeado?.rol === 'ADMIN';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
