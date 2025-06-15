export interface Consumidor {
  cedula: string;
  nombre: string;
  telefono: string;
  empresaNIT: string;
  rutaImagen?: string;
}

export interface ConsumidorResponseDTO {
  cedula: string;
  nombre: string;
  telefono: string;
  empresaNIT: string;
  rutaImagen?: string;
} 