export interface EmailMultiRequestDto {
  emailsDestinatarios: string[];
  asunto: string;
  texto: string;
}