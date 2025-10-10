
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
    organizadorId?: number; 
    cuentaBancaria?: CuentaBancaria;
    cuentaBancariaId?: number; 
    provincia?: Provincia;
    provinciaId?: number; 
    nombre: string;
    descripcion?: string;
    rutaImg?: string;
    direccion?: string;
    horaInicio: string;
    horaFin: string;
    puntosAsistencia?: number;
    costoInterno?: number;
    costoInscripcion?: number;
    sponsor?: Sponsor;
    sponsorId?: number; 
    participantes?: Usuario[];
}