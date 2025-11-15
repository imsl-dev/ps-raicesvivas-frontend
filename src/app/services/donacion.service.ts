import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DonacionRequest } from "../models/dtos/pagos/DonacionRequest";
import { MercadoPagoResponse } from "../models/dtos/pagos/MercadoPagoResponse";
import { PagoResponse } from "../models/dtos/pagos/PagoResponse";

@Injectable({
  providedIn: 'root'
})
export class DonacionService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/donaciones';

  /**
   * Crea una donación y retorna la URL de MercadoPago
   */
  crearDonacion(request: DonacionRequest): Observable<MercadoPagoResponse> {
    return this.http.post<MercadoPagoResponse>(this.API_URL, request);
  }

  /**
   * Obtiene las últimas donaciones aprobadas
   */
  obtenerUltimasDonaciones(): Observable<PagoResponse[]> {
    return this.http.get<PagoResponse[]>(`${this.API_URL}/ultimas`);
  }
}