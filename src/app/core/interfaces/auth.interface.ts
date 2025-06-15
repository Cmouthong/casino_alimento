import { UserRole } from './user.interface';

export interface AuthResponse {
  id: number;
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: UserRole;
  token: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
} 