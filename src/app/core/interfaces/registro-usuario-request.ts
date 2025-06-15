import { UserRole } from './user.interface';

export interface RegistroUsuarioRequest {
  cedula?: string;        // Solo en creación
  password: string;
  rol?: UserRole;         // Solo en creación
  email: string;
  nombre: string;
  telefono: string;
}
