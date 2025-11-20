import { Observable } from "rxjs";
import { MercadoPagoResponse } from "../models/dtos/pagos/MercadoPagoResponse";
import { PagoRequest } from "../models/dtos/pagos/PagoRequest";
import { PagoResponse } from "../models/dtos/pagos/PagoResponse";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/pagos';

  /**
   * Crea un pago y retorna la URL de MercadoPago
   */
  crearPago(request: PagoRequest): Observable<MercadoPagoResponse> {
    return this.http.post<MercadoPagoResponse>(this.API_URL, request);
  }

  /**
   * Obtiene un pago por ID
   */
  obtenerPago(pagoId: number): Observable<PagoResponse> {
    return this.http.get<PagoResponse>(`${this.API_URL}/${pagoId}`);
  }

  /**
   * Obtiene los pagos de un usuario
   */
  obtenerPagosPorUsuario(usuarioId: number): Observable<PagoResponse[]> {
    return this.http.get<PagoResponse[]>(`${this.API_URL}/usuario/${usuarioId}`);
  }

  /**
   * Obtiene los pagos de un evento
   */
  obtenerPagosPorEvento(eventoId: number): Observable<PagoResponse[]> {
    return this.http.get<PagoResponse[]>(`${this.API_URL}/evento/${eventoId}`);
  }

  /**
   * Verifica si el usuario ya pagó la inscripción
   */
  verificarPago(usuarioId: number, eventoId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/verificar`, {
      params: { usuarioId: usuarioId.toString(), eventoId: eventoId.toString() }
    });
  }
}