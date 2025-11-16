export interface DonacionRequest {
  usuarioId: number;
  eventoId: number;
  monto: number;
  mensaje?: string;
}