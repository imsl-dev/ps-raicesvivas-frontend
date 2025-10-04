export enum EstadoEvento {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
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
  REFORESTACION = 'REFORESTACION',
  RECOLECCION_BASURA = 'RECOLECCION_BASURA',
  JUNTA_ALIMENTOS = 'JUNTA_ALIMENTOS',
  DONACIONES = 'DONACIONES'
}