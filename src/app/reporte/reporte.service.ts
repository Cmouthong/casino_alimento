import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private apiUrl = '/reportes'; // Ruta base para los reportes

  constructor(private http: HttpClient) {}

  // Obtener todos los reportes
  obtenerReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener reportes por empresa
  obtenerReportesPorEmpresa(nit: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empresa/${nit}`);
  }

  // Crear un nuevo reporte
  crearReporte(reporteRequest: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reporteRequest);
  }

  // Eliminar un reporte
  eliminarReporte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}