import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-peticiones',
  imports: [CommonModule],
  templateUrl: './gestion-peticiones.html',
  styleUrl: './gestion-peticiones.css'
})
export class GestionPeticiones implements OnInit {
  loading: boolean = false;

  ngOnInit(): void {
    // TODO: Implementar lógica para cargar peticiones
    console.log('Peticiones Organizadores component initialized');
  }
}