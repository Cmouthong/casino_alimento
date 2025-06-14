export interface Consumo {
  id?: number;
  consumidorId: number;
  platoId?: number;
  cantidad: number;
  fecha: string;
  monto: number;
}

export interface ConsumoDTO {
  id?: number;
  consumidorId: number;
  platoId: number;
  cantidad: number;
  fecha: Date;
  monto: number;
} 