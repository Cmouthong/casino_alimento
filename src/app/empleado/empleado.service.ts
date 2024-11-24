import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiUrl = '/empleados'; // Utiliza el proxy configurado para redirigir al backend

  constructor(private http: HttpClient) {}

  // Obtener todos los empleados
  obtenerTodosLosEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener un empleado por cédula
  obtenerEmpleadoPorCedula(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${cedula}`);
  }

  // Añadir un nuevo empleado
  anadirEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, empleado);
  }

  // Actualizar un empleado existente
  actualizarEmpleado(cedula: string, detallesEmpleado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cedula}`, detallesEmpleado);
  }

  // Eliminar un empleado
  eliminarEmpleado(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cedula}`);
  }
}