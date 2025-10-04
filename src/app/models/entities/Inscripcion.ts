import { EstadoInscripcion } from '../enums/Enums';

export interface Inscripcion {
    id?: number;
    usuarioId: number;
    eventoId: number;
    estado: EstadoInscripcion;
}