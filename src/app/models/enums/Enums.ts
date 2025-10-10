export enum EstadoEvento {
  PENDIENTE = 'PENDIENTE',
  EN_CURSO = 'EN CURSO',
  CANCELADO = 'CANCELADO',
  FINALIZADO = 'FINALIZADO'
}

export enum EstadoInscripcion {
  PRESENTE = 'PRESENTE',
  AUSENTE = 'AUSENTE',
  PENDIENTE = 'PENDIENTE'
}

export enum EstadoPeticion {
  ACEPTADO = 'ACEPTADO',
  CANCELADO = 'CANCELADO',
  PENDIENTE = 'PENDIENTE'
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
  ORGANIZADOR = 'ORGANIZADOR'
}

export enum TipoDocumento {
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE'
}

export enum TipoEvento {
  REFORESTACION = 'Reforestacion',
  RECOLECCION_BASURA = 'Recoleccion de Basura',
  JUNTA_ALIMENTOS = 'Junta de Alimentos',
  DONACIONES = 'Donaciones'
}