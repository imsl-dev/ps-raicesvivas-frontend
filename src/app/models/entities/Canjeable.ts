import { Sponsor } from "./Sponsor";

export interface Canjeable {
  id?: number;
  nombre: string;
  sponsorId: number;
  url?: string;
  costoPuntos: number;
  validoHasta: string;
  nombreSponsor: string;
  sponsor?: Sponsor
  activo?: boolean;
}