export interface NuevoCanjeableDTO {
    nombre: string,
    sponsorId: number,
    url: string,
    costoPuntos: number,
    validoHasta: string,
    nombreSponsor: string
    activo?: boolean;
}