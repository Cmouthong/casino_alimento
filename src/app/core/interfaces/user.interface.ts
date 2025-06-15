export enum UserRole {
  ADMIN = 'ADMIN',
  CAJERO = 'CAJERO',
  CONTADOR = 'CONTADOR'
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  cedula: string;
  telefono: string;
  rol: UserRole;
  token?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
} 