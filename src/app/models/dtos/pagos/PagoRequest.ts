export interface PagoRequest {
  usuarioId: number;
  eventoId?: number;
  tipoPago: 'INSCRIPCION' | 'DONACION';
  monto: number;
  descripcion?: string;
}