
import { EstadoPeticion, RolUsuario, TipoDocumento } from '../enums/Enums';
import { Provincia } from './auxiliares/Provincia';


export interface Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    tipoDocumento?: TipoDocumento;
    nroDocumento?: string;
    rol?: RolUsuario;
    provincia?: Provincia;
    puntos?: number;
    rutaImg?: string
    email?: string;
}