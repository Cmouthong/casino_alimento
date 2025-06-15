import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { RegistroUsuarioRequest } from '../interfaces/registro-usuario-request';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/admin/usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getEliminados(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/desactivados`);
  }

  create(data: RegistroUsuarioRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, data);
  }

  update(cedula: string, data: { nombre: string; email: string; telefono: string; password?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cedula}`, data);
  }

  delete(cedula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cedula}`);
  }

  reactivar(cedula: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reactivar/${cedula}`, {});
  }
}
