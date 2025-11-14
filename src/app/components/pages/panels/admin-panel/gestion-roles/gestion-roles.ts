import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-roles',
  imports: [CommonModule],
  templateUrl: './gestion-roles.html',
  styleUrl: './gestion-roles.css'
})
export class GestionRoles implements OnInit {
  loading: boolean = false;

  ngOnInit(): void {
    // TODO: Implementar lógica para gestión de permisos
    console.log('Gestión Permisos component initialized');
  }
}