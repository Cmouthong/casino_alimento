import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/empresas'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Obtener todas las empresas
  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Registrar una nueva empresa
  registrarEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa);
  }

  // Eliminar una empresa por su NIT
  eliminarEmpresa(nit: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nit}`);
  }
}