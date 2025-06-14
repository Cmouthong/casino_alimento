import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';


@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/admin/usuarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  delete(cedula: string) {
    return this.http.delete(`${this.apiUrl}/${cedula}`, { responseType: 'text' });
  }

  update(cedula: string, data: Partial<User>) {
    return this.http.put(`${this.apiUrl}/${cedula}`, data, { responseType: 'text' });
  }

  reactivar(cedula: string) {
    return this.http.put(`${this.apiUrl}/reactivar/${cedula}`, {}, { responseType: 'text' });
  }

  create(data: any) {
    return this.http.post(`${this.apiUrl}/registrar`, data, { responseType: 'json' });
  }

  getEliminados() {
    return this.http.get<any[]>(`${this.apiUrl}/eliminados`);
  }

  // Otros métodos (editar, desactivar, reactivar) se agregarán después
} 