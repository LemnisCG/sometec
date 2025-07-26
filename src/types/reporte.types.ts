export interface FormData  {
  fecha: string;
  contrato: string;
  zonaTrabajo: string;
  supervisor: string;
  prevencionista: string;
  vehiculos: string;
  personal: string;
  itoMetro: string;
  acuerdos: string;
  horaIngreso: string;
  horaSalida: string;
};

export interface SAF  {
  titulo: string;
  detalle: string;
};
export interface DocumentacionCamara {
  fotoUrl: string;
  descripcion: string;
}

export interface Trabajo {
  estacion: string;
  saf: SAF[];
  observaciones: string;
  documentacionCamara: DocumentacionCamara[];
};
