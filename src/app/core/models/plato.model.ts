export type CategoriaPlato = 'ENTRADA' | 'PRINCIPAL' | 'POSTRE' | 'BEBIDA';

export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaPlato;
} 