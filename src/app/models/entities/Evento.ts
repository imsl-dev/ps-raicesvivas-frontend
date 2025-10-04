
import { Usuario } from './Usuario';
import { EstadoEvento, TipoEvento } from '../enums/Enums';
import { CuentaBancaria } from './auxiliares/CuentaBancaria';
import { Provincia } from './auxiliares/Provincia';
import { Sponsor } from './Sponsor';


export interface Evento {
    id?: number;
    tipo: TipoEvento;
    estado: EstadoEvento;
    organizador?: Usuario;
    cuentaBancaria?: CuentaBancaria;
    provincia?: Provincia;
    nombre: string;
    descripcion?: string;
    rutaImg?: string;
    direccion?: string;
    horaInicio: string; // ISO 8601 string format
    horaFin: string; // ISO 8601 string format
    puntosAsistencia?: number;
    costoInterno?: number;
    costoInscripcion?: number;
    sponsor?: Sponsor;
    participantes?: Usuario[];
}