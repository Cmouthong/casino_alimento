import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private apiUrl = 'http://localhost:8080/reportes'; // Cambia esta URL si tu backend está en otro host o puerto

  constructor(private http: HttpClient) {}

  // Obtener todos los reportes
  obtenerTodosLosReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener reportes por empresa (NIT)
  obtenerReportesPorEmpresa(nit: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empresa/${nit}`);
  }

  // Crear un nuevo reporte
  crearReporte(nitEmpresa: string, fechaInicio: string, fechaFin: string): Observable<any> {
    const params = {
      nitEmpresa,
      fechaInicio,
      fechaFin,
    };
    return this.http.post<any>(`${this.apiUrl}`, null, { params });
  }

  // Eliminar un reporte por ID
  eliminarReporte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
