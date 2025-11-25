
import { CanjeableDTO } from '../dtos/canjeables/CanjeableDTO';
import { EstadoPeticion, RolUsuario, TipoDocumento } from '../enums/Enums';
import { Provincia } from './auxiliares/Provincia';
import { Canjeable } from './Canjeable';


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
    canjeables?: CanjeableDTO[]
}