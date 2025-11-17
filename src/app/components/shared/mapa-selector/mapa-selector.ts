import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mapa-selector-container">
      <div class="mapa-info">
        <span class="info-icon">📍</span>
        <span class="info-text">Haz clic en el mapa para seleccionar la ubicación exacta del evento</span>
      </div>
      <div [id]="mapId" class="mapa-contenedor"></div>
      @if (ubicacionSeleccionada) {
        <div class="ubicacion-confirmada">
          <span class="check-icon">✅</span>
          <span>Ubicación seleccionada: {{ latitud.toFixed(6) }}, {{ longitud.toFixed(6) }}</span>
          <button type="button" class="btn-limpiar" (click)="limpiarUbicacion()">🗑️ Limpiar</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .mapa-selector-container {
      width: 100%;
      margin: 1rem 0;
    }

    .mapa-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      border-radius: 10px;
      margin-bottom: 1rem;
      border-left: 4px solid #28a745;
    }

    .info-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .info-text {
      color: #155724;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .mapa-contenedor {
      width: 100%;
      height: 400px;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      cursor: crosshair;
    }

    .ubicacion-confirmada {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
      border-radius: 10px;
      margin-top: 1rem;
      border: 2px solid #28a745;
    }

    .check-icon {
      font-size: 1.5rem;
    }

    .ubicacion-confirmada span {
      flex: 1;
      color: #155724;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .btn-limpiar {
      padding: 0.5rem 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .btn-limpiar:hover {
      background: #c82333;
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      .mapa-contenedor {
        height: 300px;
      }

      .info-text {
        font-size: 0.85rem;
      }

      .ubicacion-confirmada {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn-limpiar {
        width: 100%;
      }
    }
  `]
})
export class MapaSelector implements AfterViewInit, OnDestroy {
  @Input() latitud: number = -31.4201; // Córdoba por defecto
  @Input() longitud: number = -64.1888;
  @Input() mapId: string = 'mapa-selector';
  
  @Output() ubicacionCambiada = new EventEmitter<{lat: number, lng: number}>();

  private map: L.Map | null = null;
  private marcador: L.Marker | null = null;
  ubicacionSeleccionada: boolean = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inicializarMapa();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    this.map = L.map(this.mapId).setView([this.latitud, this.longitud], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Si ya hay coordenadas, mostrar marcador
    if (this.latitud && this.longitud) {
      this.agregarMarcador(this.latitud, this.longitud);
      this.ubicacionSeleccionada = true;
    }

    // Evento de clic en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.agregarMarcador(e.latlng.lat, e.latlng.lng);
      this.ubicacionSeleccionada = true;
      this.ubicacionCambiada.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }

  private agregarMarcador(lat: number, lng: number): void {
    // Remover marcador anterior si existe
    if (this.marcador) {
      this.marcador.remove();
    }

    const iconoVerde = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marcador = L.marker([lat, lng], { icon: iconoVerde })
      .addTo(this.map!)
      .bindPopup('📍 Ubicación del evento')
      .openPopup();

    this.latitud = lat;
    this.longitud = lng;

    this.map!.setView([lat, lng], this.map!.getZoom());
  }

  limpiarUbicacion(): void {
    if (this.marcador) {
      this.marcador.remove();
      this.marcador = null;
    }
    this.ubicacionSeleccionada = false;
    this.ubicacionCambiada.emit({ lat: 0, lng: 0 });
  }
}