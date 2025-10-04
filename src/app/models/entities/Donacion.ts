export interface Donacion {
  id?: number;
  eventoId: number;
  usuarioId: number;
  fecha: string; // ISO 8601 string format
  monto: number;
  mensaje?: string;
}