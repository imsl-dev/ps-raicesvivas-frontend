import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-detalle-evento',
  standalone: true,
  template: `<div [id]="mapId" class="mapa-contenedor"></div>`,
  styles: [`
    .mapa-contenedor {
      width: 100%;
      height: 400px;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .mapa-contenedor {
        height: 300px;
      }
    }
  `]
})
export class MapaDetalleEvento implements AfterViewInit, OnDestroy {
  @Input() latitud: number = -31.4201;
  @Input() longitud: number = -64.1888;
  @Input() nombreEvento: string = 'Evento';
  @Input() direccion: string = '';
  @Input() mapId: string = 'map';

  private map: L.Map | null = null;

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    this.map = L.map(this.mapId).setView([this.latitud, this.longitud], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const iconoVerde = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const popup = `
      <div style="text-align: center;">
        <strong style="color: #28a745; font-size: 1.1em;">${this.nombreEvento}</strong>
        ${this.direccion ? `<br><span style="color: #6c757d;">${this.direccion}</span>` : ''}
      </div>
    `;

    L.marker([this.latitud, this.longitud], { icon: iconoVerde })
      .addTo(this.map)
      .bindPopup(popup)
      .openPopup();
  }
}