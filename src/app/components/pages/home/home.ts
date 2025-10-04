import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Estadísticas de impacto
  stats = [
    { number: '15,000+', label: 'Árboles Plantados', icon: '🌳' },
    { number: '500+', label: 'Voluntarios Activos', icon: '👥' },
    { number: '25', label: 'Zonas Reforestadas', icon: '🌍' },
    { number: '50 Ha', label: 'Área Recuperada', icon: '🌿' }
  ];

  // Próximos eventos de reforestación
  events = [
    {
      title: 'Reforestación Sierra de Córdoba',
      date: '15 de Octubre, 2025',
      location: 'Sierra de Córdoba',
      participants: 45,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop'
    },
    {
      title: 'Plantación Comunitaria Urbana',
      date: '22 de Octubre, 2025',
      location: 'Parque Sarmiento',
      participants: 30,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop'
    },
    {
      title: 'Jornada Familiar de Plantación',
      date: '5 de Noviembre, 2025',
      location: 'Reserva Natural',
      participants: 60,
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=300&fit=crop'
    }
  ];

  // Testimonios
  testimonials = [
    {
      name: 'María González',
      role: 'Voluntaria desde 2023',
      text: 'Participar en Raíces Vivas cambió mi perspectiva sobre el cuidado ambiental. Es increíble ver cómo crece cada árbol que plantamos.',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=28a745&color=fff'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Coordinador de Zona',
      text: 'La organización y el compromiso del equipo es admirable. Juntos estamos haciendo una diferencia real en nuestro ecosistema.',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=28a745&color=fff'
    },
    {
      name: 'Ana Martínez',
      role: 'Voluntaria Familiar',
      text: 'Traigo a mis hijos a cada jornada. Es una experiencia educativa invaluable y divertida para toda la familia.',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=28a745&color=fff'
    }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
