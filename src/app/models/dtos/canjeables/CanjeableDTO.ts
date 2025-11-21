import { Sponsor } from "../../entities/Sponsor";

export interface CanjeableDTO {
    id: number,
    nombre: string,
    sponsorId: number,
    url: string,
    costoPuntos: number,
    validoHasta: string,
    nombreSponsor: string,
    sponsor: Sponsor
}
// private Integer id;
// private String nombre;
// private Integer sponsorId;
// private String url;
// private Integer costoPuntos;
// private LocalDateTime validoHasta;
// private Sponsor sponsor;