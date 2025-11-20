import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface CoordenadaResult {
  latitud: number;
  longitud: number;
  direccionCompleta: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  /**
   * Busca coordenadas a partir de una dirección
   */
  buscarCoordenadas(direccion: string): Observable<CoordenadaResult[]> {
    if (!direccion || direccion.trim() === '') {
      return of([]);
    }

    const params = {
      q: direccion,
      format: 'json',
      addressdetails: '1',
      limit: '5'
    };

    return this.http.get<any[]>(this.NOMINATIM_URL, { params }).pipe(
      map(results => results.map(r => ({
        latitud: parseFloat(r.lat),
        longitud: parseFloat(r.lon),
        direccionCompleta: r.display_name
      })))
    );
  }

  /**
   * Busca dirección a partir de coordenadas (geocodificación inversa)
   */
  buscarDireccionPorCoordenadas(lat: number, lon: number): Observable<string> {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      format: 'json'
    };

    return this.http.get<any>(url, { params }).pipe(
      map(result => result.display_name || `${lat}, ${lon}`)
    );
  }
}