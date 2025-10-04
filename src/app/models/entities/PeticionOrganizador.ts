import { EstadoPeticion } from '../enums/Enums';

export interface PeticionOrganizador {
    id?: number;
    usuarioId: number;
    estadoPeticion: EstadoPeticion;
    mensajeUsuario?: string;
}