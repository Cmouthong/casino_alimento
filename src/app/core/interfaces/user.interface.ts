export enum UserRole {
  ADMIN = 'ADMIN',
  CAJERO = 'CAJERO',
  CONTADOR = 'CONTADOR',
  CONSUMIDOR = 'CONSUMIDOR'
}

export interface User {
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: UserRole;
  token?: string;
}
export interface AuthResponse {
  token: string;
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
} 