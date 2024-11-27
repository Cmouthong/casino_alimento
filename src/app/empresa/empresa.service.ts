import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private apiUrl = '/empresas'; // URL base de la API

  constructor(private http: HttpClient) {}

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa);
  }

  actualizarEmpresa(nit: string, empresa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${nit}`, empresa);
  }

  eliminarEmpresa(nit: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nit}`);
  }
}