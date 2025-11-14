import { EstadoPeticion } from '../enums/Enums';

export interface PeticionOrganizador {
    id?: number;
    usuarioId: number;
    estadoPeticion: EstadoPeticion;
    mensajeUsuario?: string;
    image64: string;
    nombreUsuario: string,
    apellidoUsuario: string,
    email: string
}