import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiUrl = '/empleados'; // Utiliza el proxy configurado para redirigir al backend

  constructor(private http: HttpClient) {}

  obtenerEmpleadoPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${cedula}`);
  }

  obtenerTodosLosEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  anadirEmpleadoConImagen(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }

  actualizarEmpleado(cedula: string, detallesEmpleado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cedula}`, detallesEmpleado);
  }

  eliminarEmpleado(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cedula}`);
  }
}
