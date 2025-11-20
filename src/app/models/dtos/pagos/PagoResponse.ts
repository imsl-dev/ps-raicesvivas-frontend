export interface PagoResponse {
  id: number;
  usuarioId: number;
  eventoId?: number;
  tipoPago: string;
  estadoPago: string;
  monto: number;
  fechaCreacion: string;
  fechaActualizacion?: string;
  mercadoPagoPreferenceId?: string;
  mercadoPagoPaymentId?: string;
  mercadoPagoStatus?: string;
  nombreEvento?: string;
  nombreUsuario?: string;
  mensaje?: string;
}