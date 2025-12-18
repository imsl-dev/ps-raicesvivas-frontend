import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/entities/Evento';

// Interfaz para Preguntas Frecuentes
interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
  expanded: boolean;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  private readonly eventoService = inject(EventoService);
  events: Evento[] = [];
  loadingEvents: boolean = true;

  // Estadísticas de impacto
  stats = [
    { number: '15,000+', label: 'Árboles Plantados', icon: '🌳' },
    { number: '500+', label: 'Voluntarios Activos', icon: '👥' },
    { number: '25', label: 'Zonas Reforestadas', icon: '🌍' },
    { number: '50 Ha', label: 'Área Recuperada', icon: '🌿' }
  ];

  // Próximos eventos de reforestación
  /*
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
  ]; */

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

  // Preguntas frecuentes
  faqs: FAQ[] = [
    {
      id: 1,
      pregunta: '¿Me inscribí a un evento pero no sumé puntos, por qué pasa esto?',
      respuesta: 'Los puntos no se otorgan al momento de inscribirse a un evento, independientemente de si este es pago o gratuito. Los puntos son otorgados una vez que asista al evento y el organizador le cargue la asistencia a través de la web, esto puede demorar algunos días luego del evento.',
      expanded: false
    },
    {
      id: 2,
      pregunta: '¿Asistí a un evento pero nunca me cargaron la asistencia, qué puedo hacer?',
      respuesta: 'En caso de que el organizador no le haya cargado la asistencia, puede encontrar su email en el detalle del evento y comunicarse de forma personal con él.',
      expanded: false
    },
    {
      id: 3,
      pregunta: '¿Qué pasará con mis puntos si solicito ser organizador?',
      respuesta: 'Por realizar la solicitud no pasará nada, pero de ser aceptado como organizador, su perfil cambiará al de organizador y los puntos acumulados se perderán. Por eso recomendamos fuertemente tener un perfil personal aparte si desea aprovechar el sistema de puntos.',
      expanded: false
    },
    {
      id: 4,
      pregunta: '¿Qué pasa si pago un evento y no asisto?',
      respuesta: 'Los eventos pagos y donaciones no tienen reembolso, por lo que al pagar la inscripción a un evento y luego no asistir, no se podrá solicitar el reintegro de la inscripción.',
      expanded: false
    },
    {
      id: 5,
      pregunta: '¿Qué sucede si realizo una donación por equivocación o dono más dinero del que quería?',
      respuesta: 'Las donaciones no cuentan con reembolsos y el organizador no tiene la obligación de devolver el dinero. Sin embargo, puede apelar a la buena fe del organizador y comunicarse con él a través del email que se encuentra en el detalle del evento.',
      expanded: false
    },
    {
      id: 6,
      pregunta: '¿Cómo funciona el sistema de canjeables?',
      respuesta: 'Al asistir a eventos y obtener la asitencia, irás sumando puntos. Estos puntos pueden ser canjeados por beneficios tales como descuentos que RaicesVivas junto con nuestros Sponsors ofrece en la tienda. Los canjeables solo pueden ser utilizados una vez y cuentan con fecha de vencimiento.',
      expanded: false
    },
    {
      id: 7,
      pregunta: '¿Que sucede si le doy al boton de "Mostrar QR" de un canjeable sin querer?',
      respuesta: 'Al clickear el boton, previo a que se muestre el código QR, le aparecerá una ventana de confirmación para evitar clicks accidentales. En caso de que haya confirmado el click, el QR se mostrará en pantalla y luego el canjeable quedará utilizado.',
      expanded: false
    }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleFaq(id: number): void {
    const faq = this.faqs.find(f => f.id === id);
    if (faq) {
      faq.expanded = !faq.expanded;
    }
  }

  ngOnInit(): void {
    this.cargarProximosEventos();
  }

  cargarProximosEventos(): void {
    this.loadingEvents = true;
    this.eventoService.getEventos().subscribe({
      next: (eventos) => {
        // Filtrar solo eventos con estado PRÓXIMO
        const eventosProximos = eventos.filter(e => e.estado === 'PRÓXIMO');

        // Ordenar por fecha de inicio (más cercanos primero)
        eventosProximos.sort((a, b) =>
          new Date(a.horaInicio).getTime() - new Date(b.horaInicio).getTime()
        );

        // Tomar solo los primeros 3
        this.events = eventosProximos.slice(0, 3);
        this.loadingEvents = false;
      },
      error: (err) => {
        console.error('Error cargando eventos:', err);
        this.events = [];
        this.loadingEvents = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }


}
